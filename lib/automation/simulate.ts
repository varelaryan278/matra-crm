import { sourceLabel } from "@/lib/mock/leads"
import { formatBRL } from "@/lib/format"
import type { FlowNode, Lead } from "@/lib/mock/types"

export type SimContext = {
  lead: Lead
  ownerName: string
  stageName: string
  channelName: string
  replied: boolean
}

export type StepResult = {
  log: string
  tone: "ok" | "info" | "warn"
  bubble?: { text: string; hsm?: string }
  question?: [string, string]
  branch?: "yes" | "no"
}

export const fillVars = (text: string, ctx: SimContext) =>
  text
    .replaceAll("{{nome}}", ctx.lead.name)
    .replaceAll("{{primeiro_nome}}", ctx.lead.name.split(" ")[0])
    .replaceAll("{{empresa}}", ctx.lead.company ?? "sua empresa")
    .replaceAll("{{responsavel}}", ctx.ownerName.split(" ")[0])
    .replaceAll("{{campanha}}", ctx.lead.campaign ?? "nosso atendimento")
    .replaceAll("{{etapa}}", ctx.stageName)

const compare = (actual: string, operator: string, expected: string) => {
  const a = actual.toLowerCase()
  const e = expected.toLowerCase()
  if (operator === "não é") return a !== e
  if (operator === "contém") return a.includes(e)
  if (operator === "maior que") return Number(actual) > Number(expected)
  if (operator === "menor que") return Number(actual) < Number(expected)
  return a === e
}

const evaluate = ({ field, operator, value }: Record<string, string>, ctx: SimContext) => {
  if (field === "Etapa") return compare(ctx.stageName, operator, value)
  if (field === "Origem") return compare(sourceLabel[ctx.lead.source], operator, value)
  if (field === "Tag") return ctx.lead.tags.some((t) => compare(t, operator === "contém" ? "é" : operator, value))
  if (field === "Valor do negócio") return compare(String(ctx.lead.value), operator, value)
  if (field === "Canal") return compare(ctx.channelName, operator, value)
  if (field === "Horário comercial") {
    const hour = new Date().getHours()
    return compare(hour >= 8 && hour < 18 ? "Sim" : "Não", operator, value)
  }
  return compare(ctx.replied ? "Sim" : "Não", operator, value)
}

export const runNode = (node: FlowNode, ctx: SimContext): StepResult => {
  const c = node.config
  switch (node.kind) {
    case "trigger":
      return { log: `Gatilho disparado para ${ctx.lead.name}`, tone: "info" }
    case "message": {
      const hsm = c.channel === "WhatsApp Oficial" && c.mode === "Template aprovado (HSM)" ? c.template : undefined
      const channel = c.channel === "Canal da conversa" ? ctx.channelName : c.channel
      return { log: `Mensagem enviada via ${channel}${hsm ? ` (template ${hsm})` : ""}`, tone: "ok", bubble: { text: fillVars(c.text, ctx), hsm } }
    }
    case "question":
      return { log: "Pergunta enviada, aguardando o lead tocar num botão", tone: "info", bubble: { text: fillVars(c.text, ctx) }, question: [c.optionA, c.optionB] }
    case "condition": {
      const ok = evaluate(c, ctx)
      return { log: `Condição “${c.field} ${c.operator} ${c.value}” → ${ok ? "Sim" : "Não"}`, tone: "info", branch: ok ? "yes" : "no" }
    }
    case "wait":
      return { log: `Aguardou ${c.amount} ${c.unit} (acelerado no teste)`, tone: "info" }
    case "move_stage":
      return { log: `Lead movido para ${c.stage}`, tone: "ok" }
    case "assign":
      return { log: c.mode === "Responsável fixo" ? `Atribuído a ${c.user}` : `Distribuído por ${c.mode.toLowerCase()}`, tone: "ok" }
    case "tag":
      return { log: `Tag “${c.tag}” ${c.action === "Remover" ? "removida" : "adicionada"}`, tone: "ok" }
    case "task":
      return { log: `Tarefa criada: ${c.title} (${c.due.toLowerCase()})`, tone: "ok" }
    case "notify":
      return { log: `Notificação para ${c.to}: ${fillVars(c.text, ctx)}`, tone: "ok" }
    case "webhook":
      return { log: `${c.method} ${c.url} → 200 OK · enviado ${formatBRL(ctx.lead.value)}`, tone: "ok" }
  }
}
