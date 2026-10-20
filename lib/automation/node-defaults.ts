import type { NodeKind } from "@/lib/mock/types"

export const branchingKinds: NodeKind[] = ["condition", "question"]

export const nodeDefaults: Record<NodeKind, Record<string, string>> = {
  trigger: { event: "Lead criado", stage: "Novo lead", source: "Qualquer origem" },
  message: { channel: "Canal da conversa", mode: "Texto livre", template: "boas_vindas_lead", text: "Olá {{primeiro_nome}}! 👋" },
  question: { text: "Posso te ajudar com mais alguma coisa?", optionA: "Sim", optionB: "Não", timeout: "24 horas" },
  condition: { field: "Respondeu a última mensagem", operator: "é", value: "Sim" },
  wait: { amount: "24", unit: "horas", business: "Não" },
  move_stage: { stage: "Qualificação" },
  assign: { mode: "Rodízio", user: "Ana Souza" },
  tag: { action: "Adicionar", tag: "quente" },
  task: { title: "Ligar para o lead", due: "Em 1 hora", owner: "Responsável do lead" },
  notify: { to: "Responsável do lead", text: "{{nome}} precisa de atenção" },
  webhook: { method: "POST", url: "https://hooks.suaempresa.com/zuno" },
}
