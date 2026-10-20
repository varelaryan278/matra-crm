import { ArrowRightLeft, Bell, CheckSquare, Clock, GitBranch, MessageCircle, MessageCircleQuestion, Play, Tag, UserRoundCog, Webhook } from "lucide-react"
import { stages, sellers } from "@/lib/mock/team"
import { approvedTemplates } from "@/lib/mock/conversations"
import type { NodeKind } from "@/lib/mock/types"

export type FieldDef = {
  key: string
  label: string
  type: "text" | "textarea" | "select"
  options?: string[]
  variables?: boolean
  showIf?: (config: Record<string, string>) => boolean
}

export type KindMeta = {
  label: string
  group: "Gatilho" | "Mensagens" | "Lógica" | "CRM" | "Integrações"
  icon: typeof Play
  tone: string
  fields: FieldDef[]
  summary: (c: Record<string, string>) => string
  branches?: (c: Record<string, string>) => [string, string]
}

const stageNames = stages.map((s) => s.name)
const sellerNames = sellers.map((s) => s.name)
const stageEvents = ["Lead entrou na etapa"]

export const variables = ["{{nome}}", "{{primeiro_nome}}", "{{empresa}}", "{{responsavel}}", "{{campanha}}", "{{etapa}}"]

export const catalog: Record<NodeKind, KindMeta> = {
  trigger: {
    label: "Gatilho",
    group: "Gatilho",
    icon: Play,
    tone: "bg-sky-500",
    fields: [
      { key: "event", label: "Quando", type: "select", options: ["Lead criado", "Lead entrou na etapa", "Mensagem recebida", "Sem resposta do lead", "Tag adicionada", "Formulário do Facebook enviado", "Horário agendado"] },
      { key: "stage", label: "Etapa", type: "select", options: stageNames, showIf: (c) => stageEvents.includes(c.event) },
      { key: "source", label: "Origem", type: "select", options: ["Qualquer origem", "Facebook Lead Ads", "Instagram Ads", "WhatsApp", "Site"], showIf: (c) => c.event === "Lead criado" },
    ],
    summary: (c) => (stageEvents.includes(c.event) ? `${c.event}: ${c.stage}` : c.event === "Lead criado" && c.source !== "Qualquer origem" ? `${c.event} · ${c.source}` : c.event),
  },
  message: {
    label: "Enviar mensagem",
    group: "Mensagens",
    icon: MessageCircle,
    tone: "bg-emerald-500",
    fields: [
      { key: "channel", label: "Canal", type: "select", options: ["Canal da conversa", "WhatsApp Oficial", "WhatsApp uazapi"] },
      { key: "mode", label: "Tipo", type: "select", options: ["Texto livre", "Template aprovado (HSM)"], showIf: (c) => c.channel === "WhatsApp Oficial" },
      { key: "template", label: "Template", type: "select", options: ["boas_vindas_lead", ...approvedTemplates.map((t) => t.name)], showIf: (c) => c.channel === "WhatsApp Oficial" && c.mode === "Template aprovado (HSM)" },
      { key: "text", label: "Mensagem", type: "textarea", variables: true },
    ],
    summary: (c) => c.text,
  },
  question: {
    label: "Pergunta com botões",
    group: "Mensagens",
    icon: MessageCircleQuestion,
    tone: "bg-teal-500",
    fields: [
      { key: "text", label: "Pergunta", type: "textarea", variables: true },
      { key: "optionA", label: "Botão 1", type: "text" },
      { key: "optionB", label: "Botão 2", type: "text" },
      { key: "timeout", label: "Esperar resposta por", type: "select", options: ["1 hora", "24 horas", "3 dias"] },
    ],
    summary: (c) => c.text,
    branches: (c) => [c.optionA || "Botão 1", c.optionB || "Botão 2"],
  },
  condition: {
    label: "Condição",
    group: "Lógica",
    icon: GitBranch,
    tone: "bg-violet-500",
    fields: [
      { key: "field", label: "Se", type: "select", options: ["Respondeu a última mensagem", "Etapa", "Origem", "Tag", "Valor do negócio", "Horário comercial", "Canal"] },
      { key: "operator", label: "Operador", type: "select", options: ["é", "não é", "contém", "maior que", "menor que"] },
      { key: "value", label: "Valor", type: "text" },
    ],
    summary: (c) => `${c.field} ${c.operator} ${c.value}`,
    branches: () => ["Sim", "Não"],
  },
  wait: {
    label: "Aguardar",
    group: "Lógica",
    icon: Clock,
    tone: "bg-amber-500",
    fields: [
      { key: "amount", label: "Quanto tempo", type: "text" },
      { key: "unit", label: "Unidade", type: "select", options: ["minutos", "horas", "dias"] },
      { key: "business", label: "Só em horário comercial", type: "select", options: ["Não", "Sim"] },
    ],
    summary: (c) => `${c.amount} ${c.unit}${c.business === "Sim" ? " úteis" : ""}`,
  },
  move_stage: {
    label: "Mover etapa",
    group: "CRM",
    icon: ArrowRightLeft,
    tone: "bg-indigo-500",
    fields: [{ key: "stage", label: "Para a etapa", type: "select", options: stageNames }],
    summary: (c) => `Mover para ${c.stage}`,
  },
  assign: {
    label: "Distribuir responsável",
    group: "CRM",
    icon: UserRoundCog,
    tone: "bg-blue-500",
    fields: [
      { key: "mode", label: "Regra", type: "select", options: ["Rodízio", "Menor carga", "Responsável fixo"] },
      { key: "user", label: "Responsável", type: "select", options: sellerNames, showIf: (c) => c.mode === "Responsável fixo" },
    ],
    summary: (c) => (c.mode === "Responsável fixo" ? `Atribuir a ${c.user}` : `Distribuir por ${c.mode.toLowerCase()}`),
  },
  tag: {
    label: "Tag",
    group: "CRM",
    icon: Tag,
    tone: "bg-pink-500",
    fields: [
      { key: "action", label: "Ação", type: "select", options: ["Adicionar", "Remover"] },
      { key: "tag", label: "Tag", type: "text" },
    ],
    summary: (c) => `${c.action} tag “${c.tag}”`,
  },
  task: {
    label: "Criar tarefa",
    group: "CRM",
    icon: CheckSquare,
    tone: "bg-lime-600",
    fields: [
      { key: "title", label: "Tarefa", type: "text" },
      { key: "due", label: "Prazo", type: "select", options: ["Em 15 min", "Em 1 hora", "Amanhã", "Em 3 dias"] },
      { key: "owner", label: "Para", type: "select", options: ["Responsável do lead", ...sellerNames] },
    ],
    summary: (c) => `${c.title} · ${c.due.toLowerCase()}`,
  },
  notify: {
    label: "Notificar equipe",
    group: "CRM",
    icon: Bell,
    tone: "bg-orange-500",
    fields: [
      { key: "to", label: "Para", type: "select", options: ["Responsável do lead", "Gestora comercial", "Equipe toda"] },
      { key: "text", label: "Aviso", type: "textarea", variables: true },
    ],
    summary: (c) => `${c.to}: ${c.text}`,
  },
  webhook: {
    label: "Webhook",
    group: "Integrações",
    icon: Webhook,
    tone: "bg-slate-600",
    fields: [
      { key: "method", label: "Método", type: "select", options: ["POST", "GET", "PUT"] },
      { key: "url", label: "URL", type: "text" },
    ],
    summary: (c) => `${c.method} ${c.url}`,
  },
}

export const addableKinds = (Object.keys(catalog) as NodeKind[]).filter((k) => k !== "trigger")

export const groups = ["Mensagens", "Lógica", "CRM", "Integrações"] as const
