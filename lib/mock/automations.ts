import { buildFlow, type NodeSpec } from "@/lib/automation/flow-ops"
import type { Automation } from "./types"

const welcome: NodeSpec[] = [
  { kind: "trigger", config: { event: "Lead criado", source: "Facebook Lead Ads" } },
  { kind: "assign", config: { mode: "Rodízio" } },
  { kind: "message", config: { channel: "WhatsApp Oficial", mode: "Template aprovado (HSM)", template: "boas_vindas_lead", text: "Olá {{primeiro_nome}}! 👋 Recebemos seu cadastro sobre {{campanha}}. Em instantes {{responsavel}} fala com você por aqui." } },
  { kind: "task", config: { title: "Ligar para o lead", due: "Em 15 min" } },
  { kind: "wait", config: { amount: "30", unit: "minutos" } },
  {
    kind: "condition",
    config: { field: "Respondeu a última mensagem", operator: "é", value: "Sim" },
    yes: [{ kind: "move_stage", config: { stage: "Qualificação" } }],
    no: [
      { kind: "message", config: { channel: "Canal da conversa", text: "{{primeiro_nome}}, conseguiu ver minha mensagem? Posso te ligar agora?" } },
      { kind: "notify", config: { to: "Responsável do lead", text: "{{nome}} ainda não respondeu as boas-vindas" } },
    ],
  },
]

const followUp: NodeSpec[] = [
  { kind: "trigger", config: { event: "Sem resposta do lead" } },
  {
    kind: "condition",
    config: { field: "Etapa", operator: "é", value: "Proposta enviada" },
    yes: [
      { kind: "message", config: { channel: "WhatsApp Oficial", mode: "Template aprovado (HSM)", template: "retomada_contato", text: "Olá {{primeiro_nome}}, tudo bem? Passando para saber se ainda tem interesse na nossa proposta." } },
      { kind: "wait", config: { amount: "48", unit: "horas", business: "Sim" } },
      {
        kind: "condition",
        config: { field: "Respondeu a última mensagem", operator: "é", value: "Sim" },
        yes: [{ kind: "tag", config: { tag: "reengajado" } }],
        no: [
          { kind: "notify", config: { to: "Gestora comercial", text: "Proposta de {{nome}} esfriando" } },
          { kind: "tag", config: { tag: "frio" } },
        ],
      },
    ],
    no: [{ kind: "message", config: { text: "Oi {{primeiro_nome}}! Ficou alguma dúvida? Estou por aqui 🙂" } }],
  },
]

const botQualify: NodeSpec[] = [
  { kind: "trigger", config: { event: "Lead entrou na etapa", stage: "Novo lead" } },
  {
    kind: "question",
    config: { text: "Oi {{primeiro_nome}}! Para te atender melhor: você procura para você ou para sua empresa?", optionA: "Para mim", optionB: "Para empresa" },
    yes: [
      { kind: "tag", config: { tag: "pessoa_fisica" } },
      { kind: "move_stage", config: { stage: "Qualificação" } },
    ],
    no: [
      { kind: "tag", config: { tag: "b2b" } },
      { kind: "assign", config: { mode: "Responsável fixo", user: "Bruno Lima" } },
      { kind: "move_stage", config: { stage: "Qualificação" } },
    ],
  },
]

const proposalReminder: NodeSpec[] = [
  { kind: "trigger", config: { event: "Lead entrou na etapa", stage: "Proposta enviada" } },
  { kind: "wait", config: { amount: "1", unit: "dias", business: "Sim" } },
  { kind: "message", config: { text: "Oi {{primeiro_nome}}, conseguiu analisar a proposta? Posso esclarecer qualquer ponto 😉" } },
  { kind: "task", config: { title: "Follow-up da proposta", due: "Amanhã" } },
]

const postSale: NodeSpec[] = [
  { kind: "trigger", config: { event: "Lead entrou na etapa", stage: "Ganho" } },
  { kind: "message", config: { text: "{{primeiro_nome}}, seja muito bem-vindo(a)! 🎉 Qualquer coisa, é só chamar." } },
  { kind: "wait", config: { amount: "7", unit: "dias" } },
  {
    kind: "question",
    config: { text: "De 0 a 10, quanto você indicaria a gente para um amigo?", optionA: "9 ou 10", optionB: "0 a 8" },
    yes: [
      { kind: "tag", config: { tag: "promotor" } },
      { kind: "message", config: { text: "Que demais! Conhece alguém que também gostaria? Manda o contato que cuidamos com carinho 💜" } },
    ],
    no: [{ kind: "notify", config: { to: "Gestora comercial", text: "NPS baixo de {{nome}}, entrar em contato" } }],
  },
]

const stalledDeal: NodeSpec[] = [
  { kind: "trigger", config: { event: "Lead entrou na etapa", stage: "Negociação" } },
  { kind: "wait", config: { amount: "3", unit: "dias" } },
  {
    kind: "condition",
    config: { field: "Etapa", operator: "é", value: "Negociação" },
    yes: [
      { kind: "notify", config: { to: "Gestora comercial", text: "Negociação com {{nome}} parada há 3 dias" } },
      { kind: "task", config: { title: "Revisar condição comercial", due: "Em 1 hora" } },
    ],
    no: [],
  },
]

const seed = (id: string, name: string, description: string, active: boolean, runs: number, successRate: number, lastRunAt: string, specs: NodeSpec[]): Automation => ({
  id,
  name,
  description,
  active,
  runs,
  successRate,
  lastRunAt,
  flow: buildFlow(id, specs),
})

export const seedAutomations: Automation[] = [
  seed("a1", "Boas-vindas ao lead do Facebook", "Responde em segundos, distribui e cobra o retorno", true, 1284, 98.7, "2026-10-19T08:12:00", welcome),
  seed("a2", "Follow-up sem resposta", "Retoma conversas paradas conforme a etapa", true, 412, 96.1, "2026-10-19T07:40:00", followUp),
  seed("a3", "Qualificação por bot", "Bot pergunta o perfil e já encaminha para o vendedor certo", false, 96, 91.4, "2026-10-12T15:20:00", botQualify),
  seed("a4", "Lembrete de proposta", "Cobra retorno 1 dia útil após a proposta", true, 233, 99.1, "2026-10-18T10:00:00", proposalReminder),
  seed("a5", "Pós-venda e NPS", "Boas-vindas ao cliente e pesquisa de satisfação", true, 58, 100, "2026-10-16T09:00:00", postSale),
  seed("a6", "Alerta de negociação parada", "Avisa a gestão quando o negócio trava", true, 41, 100, "2026-10-17T18:30:00", stalledDeal),
]

export type Template = { id: string; name: string; category: string; description: string; icon: string; specs: NodeSpec[] }

export const templates: Template[] = [
  { id: "t1", name: "Boas-vindas instantâneas", category: "Captação", description: "Resposta em segundos para todo lead de anúncio, com cobrança de retorno", icon: "zap", specs: welcome },
  {
    id: "t2",
    name: "Rodízio com horário comercial",
    category: "Distribuição",
    description: "Distribui na hora em horário comercial e avisa o lead fora dele",
    icon: "users",
    specs: [
      { kind: "trigger", config: { event: "Lead criado" } },
      {
        kind: "condition",
        config: { field: "Horário comercial", operator: "é", value: "Sim" },
        yes: [{ kind: "assign", config: { mode: "Rodízio" } }, { kind: "notify", config: { to: "Responsável do lead", text: "Novo lead: {{nome}}" } }],
        no: [{ kind: "message", config: { text: "Oi {{primeiro_nome}}! Recebemos seu contato, retornamos amanhã às 8h ☀️" } }, { kind: "assign", config: { mode: "Menor carga" } }],
      },
    ],
  },
  { id: "t3", name: "Follow-up inteligente", category: "Engajamento", description: "Sequência de retomada que muda conforme a etapa do lead", icon: "clock", specs: followUp },
  { id: "t4", name: "Qualificação por bot", category: "Qualificação", description: "Bot com botões define o perfil e direciona o lead", icon: "bot", specs: botQualify },
  {
    id: "t5",
    name: "Lembrete de reunião",
    category: "Agenda",
    description: "Template aprovado 1 dia antes e lembrete 1 hora antes",
    icon: "calendar",
    specs: [
      { kind: "trigger", config: { event: "Horário agendado" } },
      { kind: "message", config: { channel: "WhatsApp Oficial", mode: "Template aprovado (HSM)", template: "lembrete_reuniao", text: "Oi {{primeiro_nome}}! Lembrete da nossa reunião amanhã às 10h." } },
      { kind: "wait", config: { amount: "23", unit: "horas" } },
      { kind: "message", config: { text: "Te espero daqui a 1 hora, {{primeiro_nome}}! Link: zuno.app/reuniao" } },
    ],
  },
  { id: "t6", name: "Pós-venda e NPS", category: "Pós-venda", description: "Boas-vindas, pesquisa de satisfação e pedido de indicação", icon: "star", specs: postSale },
  {
    id: "t7",
    name: "Reativar leads frios",
    category: "Reativação",
    description: "Volta a falar com quem esfriou depois de 30 dias",
    icon: "flame",
    specs: [
      { kind: "trigger", config: { event: "Tag adicionada" } },
      { kind: "wait", config: { amount: "30", unit: "dias" } },
      { kind: "message", config: { text: "{{primeiro_nome}}, temos novidades que combinam com você! Posso te mostrar?" } },
      {
        kind: "condition",
        config: { field: "Respondeu a última mensagem", operator: "é", value: "Sim" },
        yes: [{ kind: "move_stage", config: { stage: "Qualificação" } }, { kind: "assign", config: { mode: "Rodízio" } }],
        no: [],
      },
    ],
  },
  {
    id: "t8",
    name: "Venda ganha para o ERP",
    category: "Integrações",
    description: "Envia o negócio ganho para seu sistema via webhook",
    icon: "webhook",
    specs: [
      { kind: "trigger", config: { event: "Lead entrou na etapa", stage: "Ganho" } },
      { kind: "webhook", config: { method: "POST", url: "https://erp.suaempresa.com/api/vendas" } },
      { kind: "notify", config: { to: "Equipe toda", text: "🎉 {{responsavel}} fechou com {{nome}}!" } },
    ],
  },
]
