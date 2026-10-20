"use client"

import { useEffect, useRef, useState } from "react"
import { CircleCheck, Info, Play, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhonePreview, type PhoneMessage } from "./phone-preview"
import { useCrm } from "@/lib/crm-store"
import { runNode, type SimContext, type StepResult } from "@/lib/automation/simulate"
import { channelLabel } from "@/lib/mock/conversations"
import { stageById, userById } from "@/lib/mock/team"
import type { Flow } from "@/lib/mock/types"

type Props = {
  flow: Flow
  onProgress: (current: string | undefined, visited: string[]) => void
}

type Log = { id: number; text: string; tone: StepResult["tone"] }

export const FlowTester = ({ flow, onProgress }: Props) => {
  const { leads, conversations } = useCrm()
  const [leadId, setLeadId] = useState(leads[0].id)
  const [status, setStatus] = useState<"idle" | "running" | "waiting" | "done">("idle")
  const [messages, setMessages] = useState<PhoneMessage[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [options, setOptions] = useState<[string, string]>()
  const pending = useRef<{ nodeId: string; visited: string[]; ctx: SimContext } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const seq = useRef(0)
  const lead = leads.find((l) => l.id === leadId) ?? leads[0]
  const leadItems = leads.map((l) => ({ value: l.id, label: l.name }))

  useEffect(() => () => clearTimeout(timer.current), [])

  const addLog = (text: string, tone: StepResult["tone"]) => setLogs((prev) => [...prev, { id: ++seq.current, text, tone }])

  const run = (nodeId: string | undefined, visited: string[], ctx: SimContext) => {
    if (!nodeId) {
      setStatus("done")
      onProgress(undefined, visited)
      addLog("Fluxo finalizado", "ok")
      return
    }
    onProgress(nodeId, visited)
    timer.current = setTimeout(() => {
      const node = flow.nodes[nodeId]
      const result = runNode(node, ctx)
      addLog(result.log, result.tone)
      if (result.bubble) setMessages((prev) => [...prev, { id: `m${++seq.current}`, from: "bot", ...result.bubble! }])
      const done = [...visited, nodeId]
      if (result.question) {
        pending.current = { nodeId, visited: done, ctx }
        setOptions(result.question)
        setStatus("waiting")
        return
      }
      run(result.branch ? node[result.branch] : node.next, done, ctx)
    }, 900)
  }

  const start = () => {
    clearTimeout(timer.current)
    const conversation = conversations.find((c) => c.id === lead.conversationId)
    const ctx: SimContext = {
      lead,
      ownerName: userById(lead.ownerId).name,
      stageName: stageById(lead.stageId).name,
      channelName: conversation ? channelLabel[conversation.channel] : "WhatsApp",
      replied: conversation?.messages.at(-1)?.from === "lead",
    }
    setMessages([])
    setLogs([])
    setOptions(undefined)
    setStatus("running")
    run(flow.rootId, [], ctx)
  }

  const answer = (index: 0 | 1) => {
    const p = pending.current
    if (!p || !options) return
    setMessages((prev) => [...prev, { id: `m${++seq.current}`, from: "lead", text: options[index] }])
    addLog(`Lead respondeu “${options[index]}”`, "info")
    setOptions(undefined)
    setStatus("running")
    run(flow.nodes[p.nodeId][index === 0 ? "yes" : "no"], p.visited, p.ctx)
  }

  const reset = () => {
    clearTimeout(timer.current)
    setMessages([])
    setLogs([])
    setOptions(undefined)
    setStatus("idle")
    onProgress(undefined, [])
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        <Select items={leadItems} value={leadId} onValueChange={(v) => v && setLeadId(v)}>
          <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {leadItems.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {status === "idle" ? (
          <Button onClick={start}><Play />Testar</Button>
        ) : (
          <Button variant="outline" onClick={reset}><RotateCcw />Limpar</Button>
        )}
      </div>
      <p className="flex gap-1.5 text-xs text-muted-foreground">
        <Info className="size-3.5 shrink-0" />
        Simulação com os dados do lead. Nada é enviado nem alterado de verdade.
      </p>

      <PhonePreview leadName={lead.name} messages={messages} options={status === "waiting" ? options : undefined} onOption={answer} />

      {status === "waiting" && <p className="text-center text-xs font-medium text-teal-700">Toque em um botão no celular para responder como o lead</p>}

      {logs.length > 0 && (
        <ol className="space-y-1.5 rounded-lg border bg-muted/40 p-3 text-xs">
          {logs.map((l) => (
            <li key={l.id} className={cn("flex gap-1.5", l.tone === "ok" ? "text-emerald-700" : l.tone === "warn" ? "text-amber-700" : "text-muted-foreground")}>
              <CircleCheck className="mt-px size-3.5 shrink-0" />
              {l.text}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
