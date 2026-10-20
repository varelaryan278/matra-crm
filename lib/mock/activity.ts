import type { Lead, LeadEvent, LeadFile, LeadTask } from "./types"
import { seedLeads, sourceLabel } from "./leads"
import { stages, userById } from "./team"
import { formatBRL, shiftIso } from "@/lib/format"

const comments = [
  "Cliente pediu para retornar depois do almoço, prefere WhatsApp a ligação.",
  "Já cotou com concorrente, o diferencial pra ele é o prazo de entrega.",
  "Decisor é o sócio, marcar reunião com os dois juntos.",
  "Pediu desconto à vista, verificar margem com a gestão antes de responder.",
]

export const creationEvents = (lead: Lead, automated: boolean): LeadEvent[] => {
  const ads = lead.source.endsWith("_ads")
  const owner = userById(lead.ownerId).name
  const events: LeadEvent[] = [
    {
      id: `${lead.id}-e-created`,
      leadId: lead.id,
      type: "created",
      at: lead.createdAt,
      text: ads
        ? `Lead criado automaticamente via ${sourceLabel[lead.source]} · formulário “${lead.campaign}”`
        : `Lead criado a partir de ${sourceLabel[lead.source]}`,
    },
    {
      id: `${lead.id}-e-owner`,
      leadId: lead.id,
      type: "owner",
      at: lead.createdAt,
      text: ads ? `Responsável definido por rodízio: ${owner}` : `Responsável definido: ${owner}`,
    },
  ]
  if (ads && automated) {
    events.push({
      id: `${lead.id}-e-bot`,
      leadId: lead.id,
      type: "automation",
      at: shiftIso(lead.createdAt, 1),
      text: "Automação “Boas-vindas ao lead do Facebook” enviou mensagem no WhatsApp",
    })
  }
  return events
}

const stageEvents = (lead: Lead): LeadEvent[] => {
  const target = stages.findIndex((s) => s.id === lead.stageId)
  return stages.slice(1, target + 1).map((stage, k) => ({
    id: `${lead.id}-e-stage${k}`,
    leadId: lead.id,
    type: "stage",
    at: shiftIso(lead.createdAt, (k + 1) * 540),
    text: `Etapa alterada: ${stages[k].name} → ${stage.name}`,
    authorId: lead.ownerId,
  }))
}

export const seedEvents: LeadEvent[] = seedLeads.flatMap((lead, i) => {
  const events = [...creationEvents(lead, true), ...stageEvents(lead)]
  if (i % 2 === 0) {
    events.push({ id: `${lead.id}-e-comment`, leadId: lead.id, type: "comment", at: shiftIso(lead.createdAt, 200), text: comments[(i / 2) % comments.length], authorId: lead.ownerId })
  }
  if (i % 3 === 1) {
    events.push({ id: `${lead.id}-e-value`, leadId: lead.id, type: "field", at: shiftIso(lead.createdAt, 300), text: `Valor alterado: ${formatBRL(Math.round(lead.value * 0.8))} → ${formatBRL(lead.value)}`, authorId: lead.ownerId })
  }
  return events
})

const stageIndex = (lead: Lead) => stages.findIndex((s) => s.id === lead.stageId)

export const seedFiles: LeadFile[] = seedLeads.flatMap((lead, i) => {
  const files: Omit<LeadFile, "id" | "leadId" | "authorId">[] = []
  if (stageIndex(lead) >= 3) files.push({ name: `Proposta_${lead.name.split(" ")[0]}.pdf`, size: 482_000 + i * 1300, at: shiftIso(lead.createdAt, 1700) })
  if (lead.tags.includes("b2b")) files.push({ name: "Orcamento_detalhado.xlsx", size: 88_000 + i * 900, at: shiftIso(lead.createdAt, 1500) })
  if (stageIndex(lead) === 5) files.push({ name: "Contrato_assinado.pdf", size: 1_240_000, at: shiftIso(lead.createdAt, 2800) })
  if (i % 4 === 1) files.push({ name: "Foto_documento.jpg", size: 2_100_000 + i * 5000, at: shiftIso(lead.createdAt, 400) })
  return files.map((f, k) => ({ ...f, id: `${lead.id}-f${k}`, leadId: lead.id, authorId: lead.ownerId }))
})

export const seedTasks: LeadTask[] = seedLeads.flatMap((lead) => {
  const idx = stageIndex(lead)
  const tasks: Omit<LeadTask, "id" | "leadId" | "ownerId">[] = [
    { title: "Primeiro contato por ligação", due: shiftIso(lead.createdAt, 15), done: idx > 0 },
  ]
  if (idx >= 2) tasks.push({ title: "Enviar proposta comercial", due: shiftIso(lead.createdAt, 1440), done: idx >= 3 })
  if (idx < 5) tasks.push({ title: "Follow-up de retomada", due: "2026-10-21T10:00:00", done: false })
  return tasks.map((t, k) => ({ ...t, id: `${lead.id}-t${k}`, leadId: lead.id, ownerId: lead.ownerId }))
})
