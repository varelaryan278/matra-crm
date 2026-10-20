export type Channel = "wa_official" | "wa_uazapi" | "instagram" | "messenger"

export type LeadSource = "facebook_ads" | "instagram_ads" | "whatsapp" | "site" | "indicacao" | "manual"

export type User = {
  id: string
  name: string
  initials: string
  color: string
  role: string
}

export type Stage = {
  id: string
  name: string
  color: string
}

export type Lead = {
  id: string
  name: string
  company?: string
  phone: string
  email?: string
  value: number
  stageId: string
  ownerId: string
  source: LeadSource
  campaign?: string
  adName?: string
  tags: string[]
  createdAt: string
  conversationId: string
  details: LeadDetails
}

export type MessageAuthor = "lead" | "agent" | "bot" | "system"

export type Message = {
  id: string
  from: MessageAuthor
  text: string
  at: string
  authorId?: string
}

export type Conversation = {
  id: string
  leadId: string
  channel: Channel
  unread: number
  windowClosed?: boolean
  messages: Message[]
}

export type ConnectionStatus = "disconnected" | "connecting" | "connected"

export type Connection = {
  status: ConnectionStatus
  phone?: string
  detail?: string
}

export type DistributionMode = "round_robin" | "menor_carga" | "fixo"

export type NodeKind = "trigger" | "message" | "question" | "condition" | "wait" | "move_stage" | "assign" | "tag" | "task" | "notify" | "webhook"

export type FlowNode = {
  id: string
  kind: NodeKind
  config: Record<string, string>
  next?: string
  yes?: string
  no?: string
}

export type Flow = {
  rootId: string
  nodes: Record<string, FlowNode>
}

export type Automation = {
  id: string
  name: string
  description: string
  active: boolean
  runs: number
  successRate: number
  lastRunAt?: string
  flow: Flow
}

export type Temperature = "quente" | "morno" | "frio"

export type LeadDetails = {
  city: string
  document: string
  birthday: string
  interest: string
  temperature: Temperature
  score: number
  utm?: { source: string; medium: string; campaign: string; content?: string }
  formAnswers: [string, string][]
}

export type LeadEventType = "created" | "stage" | "owner" | "comment" | "file" | "task" | "field" | "automation"

export type LeadEvent = {
  id: string
  leadId: string
  type: LeadEventType
  at: string
  text: string
  authorId?: string
}

export type LeadFile = {
  id: string
  leadId: string
  name: string
  size: number
  at: string
  authorId: string
}

export type LeadTask = {
  id: string
  leadId: string
  title: string
  due: string
  done: boolean
  ownerId: string
}
