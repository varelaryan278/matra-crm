"use client"

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { seedLeads, incomingPool } from "./mock/leads"
import { seedConversations, autoReplies } from "./mock/conversations"
import { seedAutomations } from "./mock/automations"
import { sellers, currentUser, stageById, userById } from "./mock/team"
import { buildDetails } from "./mock/lead-profile"
import { creationEvents } from "./mock/activity"
import { useLeadActivity } from "./lead-activity"
import { formatBRL, localNowIso } from "./format"
import type { Automation, Connection, Conversation, DistributionMode, Lead, Message } from "./mock/types"

export type ConnectionKey = "wa_official" | "wa_uazapi" | "facebook_leads" | "instagram" | "messenger"

const seedConnections: Record<ConnectionKey, Connection> = {
  wa_official: { status: "connected", phone: "+55 43 3027-0409", detail: "WABA Matra Comercial" },
  wa_uazapi: { status: "connected", phone: "+55 43 99914-0409", detail: "Instância vendas-01" },
  facebook_leads: { status: "connected", detail: "Página Matra Tecnologia · 3 formulários" },
  instagram: { status: "disconnected" },
  messenger: { status: "disconnected" },
}

const nowTime = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

const useCrmState = () => {
  const [leads, setLeads] = useState<Lead[]>(seedLeads)
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations)
  const [automations, setAutomations] = useState<Automation[]>(seedAutomations)
  const [connections, setConnections] = useState(seedConnections)
  const [distribution, setDistribution] = useState<DistributionMode>("round_robin")
  const [fixedOwnerId, setFixedOwnerId] = useState(sellers[0].id)
  const [openLeadId, setOpenLeadId] = useState<string | null>(null)
  const counter = useRef(0)
  const rrIndex = useRef(0)

  const nextId = (prefix: string) => `${prefix}-n${++counter.current}`

  const appendMessage = useCallback((conversationId: string, message: Message, unreadDelta = 0) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread: c.unread + unreadDelta, messages: [...c.messages, message] } : c)),
    )
  }, [])

  const activity = useLeadActivity()

  const moveLead = (leadId: string, stageId: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.stageId === stageId) return
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stageId } : l)))
    activity.logEvent(leadId, "stage", `Etapa alterada: ${stageById(lead.stageId).name} → ${stageById(stageId).name}`)
  }

  const updateLead = (leadId: string, patch: Partial<Lead>) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...patch } : l)))
    if (patch.ownerId && patch.ownerId !== lead.ownerId) {
      activity.logEvent(leadId, "owner", `Responsável alterado: ${userById(lead.ownerId).name} → ${userById(patch.ownerId).name}`)
    }
    if (patch.value !== undefined && patch.value !== lead.value) {
      activity.logEvent(leadId, "field", `Valor alterado: ${formatBRL(lead.value)} → ${formatBRL(patch.value)}`)
    }
  }

  const markRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId && c.unread ? { ...c, unread: 0 } : c)))
  }, [])

  const sendMessage = useCallback(
    (conversationId: string, text: string, from: Message["from"] = "agent") => {
      appendMessage(conversationId, { id: nextId("m"), from, text, at: nowTime(), authorId: currentUser.id })
      setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, windowClosed: false } : c)))
      const reply = autoReplies[counter.current % autoReplies.length]
      setTimeout(() => appendMessage(conversationId, { id: nextId("m"), from: "lead", text: reply, at: nowTime() }), 2200)
    },
    [appendMessage],
  )

  const pickOwner = (current: Lead[]) => {
    if (distribution === "fixo") return fixedOwnerId
    if (distribution === "menor_carga") {
      const load = (id: string) => current.filter((l) => l.ownerId === id && l.stageId !== "s6").length
      return [...sellers].sort((a, b) => load(a.id) - load(b.id))[0].id
    }
    const owner = sellers[rrIndex.current % sellers.length].id
    rrIndex.current += 1
    return owner
  }

  const simulateFacebookLead = () => {
    const base = incomingPool[counter.current % incomingPool.length]
    const n = ++counter.current
    const ownerId = pickOwner(leads)
    const lead: Lead = {
      ...base,
      id: `lnew${n}`,
      stageId: "s1",
      ownerId,
      tags: ["novo"],
      createdAt: localNowIso(),
      conversationId: `cnew${n}`,
      details: buildDetails({ ...base, tags: ["novo"] }, n),
    }
    const channel = connections.wa_official.status === "connected" ? "wa_official" : "wa_uazapi"
    const welcome = automations.find((a) => a.id === "a1")?.active
    const messages: Message[] = [
      { id: `cnew${n}-sys`, from: "system", text: `Lead recebido via ${base.source === "instagram_ads" ? "Instagram" : "Facebook"} Lead Ads · ${base.campaign}`, at: nowTime() },
    ]
    if (welcome) {
      messages.push({ id: `cnew${n}-bot`, from: "bot", text: `Olá, ${base.name.split(" ")[0]}! 👋 Recebemos seu cadastro. Em instantes um especialista fala com você por aqui.`, at: nowTime() })
    }
    setLeads((prev) => [lead, ...prev])
    setConversations((prev) => [{ id: lead.conversationId, leadId: lead.id, channel, unread: 1, messages }, ...prev])
    activity.addEvents(creationEvents(lead, !!welcome))
    if (welcome) setAutomations((prev) => prev.map((a) => (a.id === "a1" ? { ...a, runs: a.runs + 1 } : a)))
    return { lead, welcome }
  }

  const setConnection = useCallback((key: ConnectionKey, value: Connection) => {
    setConnections((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleAutomation = useCallback((id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)))
  }, [])

  const deleteAutomation = useCallback((id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const saveAutomation = useCallback((automation: Automation) => {
    setAutomations((prev) => (prev.some((a) => a.id === automation.id) ? prev.map((a) => (a.id === automation.id ? automation : a)) : [automation, ...prev]))
  }, [])

  return {
    ...activity,
    leads,
    conversations,
    automations,
    connections,
    distribution,
    fixedOwnerId,
    openLeadId,
    setDistribution,
    setFixedOwnerId,
    setOpenLeadId,
    moveLead,
    updateLead,
    markRead,
    sendMessage,
    simulateFacebookLead,
    setConnection,
    toggleAutomation,
    saveAutomation,
    deleteAutomation,
  }
}

type CrmStore = ReturnType<typeof useCrmState>

const CrmContext = createContext<CrmStore | null>(null)

export const CrmProvider = ({ children }: { children: ReactNode }) => {
  const store = useCrmState()
  return <CrmContext.Provider value={store}>{children}</CrmContext.Provider>
}

export const useCrm = () => {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error("useCrm fora do CrmProvider")
  return ctx
}
