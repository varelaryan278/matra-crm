import type { Channel, Conversation, Message } from "./types"
import { seedLeads } from "./leads"

const scripts: [string, string][][] = [
  [["lead", "Oi! Vi o anúncio de vocês, queria saber o valor"], ["bot", "Olá! 👋 Obrigado pelo contato. Um especialista já vai te atender."], ["lead", "Tem horário essa semana?"]],
  [["lead", "Boa tarde, ainda está valendo a promoção?"], ["agent", "Boa tarde! Está sim, até sexta. Posso te mandar os detalhes?"], ["lead", "Pode sim 🙏"]],
  [["lead", "Quero agendar uma visita no apartamento"], ["agent", "Perfeito! Qual o melhor dia pra você?"]],
  [["lead", "Vocês atendem aos sábados?"]],
  [["agent", "Oi Fernanda, tudo bem? Conseguiu ver a proposta?"], ["lead", "Vi sim, vou conversar com meu sócio e te retorno"]],
  [["lead", "Preciso de orçamento para 3 unidades"], ["agent", "Claro, Lucas! Já estou montando aqui."], ["agent", "Te envio até amanhã cedo 👍"]],
  [["lead", "Qual a forma de pagamento?"], ["agent", "Aceitamos PIX, cartão em até 12x e boleto."]],
  [["agent", "Gustavo, segue o material que comentei"], ["lead", "Recebi, obrigado!"], ["lead", "Consegue um desconto à vista?"]],
  [["lead", "A Bruna me indicou vocês"], ["agent", "Que bom! Seja bem-vinda, Camila 😊"]],
  [["agent", "Rodrigo, podemos marcar a call com o time técnico?"], ["lead", "Pode ser quinta 14h"]],
  [["agent", "Aline, proposta enviada no seu e-mail!"], ["lead", "Show, vou olhar hoje"]],
  [["agent", "Marcos, alguma dúvida sobre a proposta?"]],
  [["lead", "Consegue melhorar a condição de pagamento?"], ["agent", "Vou verificar com a gestão e te retorno ainda hoje."], ["lead", "Fico no aguardo"]],
  [["agent", "Felipe, contrato ajustado conforme combinamos"], ["lead", "Vou passar pro jurídico"]],
  [["lead", "Pagamento feito! Segue comprovante"], ["agent", "Recebido, Larissa! Muito obrigado 🎉"]],
  [["agent", "Contrato assinado, bem-vindo Vinícius!"], ["lead", "Obrigado pela atenção de todos"]],
]

const channels: Channel[] = ["wa_official", "wa_uazapi", "wa_official", "wa_uazapi", "wa_official", "wa_uazapi", "wa_uazapi", "wa_official", "wa_uazapi", "wa_official", "wa_official", "wa_uazapi", "wa_official", "wa_uazapi", "wa_official", "wa_uazapi"]

const unread = [2, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0]

const hours = ["08:14", "07:58", "19:42", "17:25", "10:07", "14:33", "09:15", "16:50", "11:23", "15:04", "10:42", "18:16", "09:33", "13:12", "10:02", "16:27"]

export const seedConversations: Conversation[] = seedLeads.map((lead, i) => ({
  id: lead.conversationId,
  leadId: lead.id,
  channel: channels[i],
  unread: unread[i],
  windowClosed: i === 11,
  messages: scripts[i].map(([from, text], j): Message => ({
    id: `${lead.conversationId}-m${j}`,
    from: from as Message["from"],
    text,
    at: hours[i],
    authorId: from === "agent" ? lead.ownerId : undefined,
  })),
}))

export const channelLabel: Record<Channel, string> = {
  wa_official: "WhatsApp Oficial",
  wa_uazapi: "WhatsApp uazapi",
}

export const autoReplies = [
  "Entendi, obrigado pelo retorno!",
  "Perfeito, combinado então 👍",
  "Pode me mandar mais detalhes?",
  "Vou ver aqui e já te falo",
  "Ótimo! Qual o próximo passo?",
]

export const quickReplies = [
  "Olá! Tudo bem? Sou da equipe comercial, como posso ajudar?",
  "Posso te enviar a proposta por aqui mesmo?",
  "Qual o melhor horário para uma ligação rápida?",
  "Segue o link para agendamento: matra.app/agenda",
]

export const approvedTemplates = [
  { name: "retomada_contato", text: "Olá {{1}}, tudo bem? Passando para saber se ainda tem interesse na nossa proposta." },
  { name: "lembrete_reuniao", text: "Oi {{1}}! Lembrete da nossa reunião amanhã às {{2}}." },
]
