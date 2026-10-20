"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversationList } from "./conversation-list"
import { ChatThread } from "./chat-thread"
import { LeadSummary } from "./lead-summary"
import { ChannelTag } from "@/components/crm/channel-badge"
import { useCrm } from "@/lib/crm-store"
import type { Channel } from "@/lib/mock/types"

const allChannels: Channel[] = ["wa_official", "wa_uazapi", "instagram", "messenger"]

type Scope = "all" | "unread" | "waiting"

export const Inbox = () => {
  const { conversations, leads, connections } = useCrm()
  const connected = allChannels.filter((c) => connections[c].status === "connected")
  const [scope, setScope] = useState<Scope>("all")
  const [channel, setChannel] = useState<Channel | "all">("all")
  const [activeId, setActiveId] = useState(conversations[0]?.id)

  const items = conversations
    .map((conversation) => ({ conversation, lead: leads.find((l) => l.id === conversation.leadId)! }))
    .filter(({ conversation }) => {
      if (channel !== "all" && conversation.channel !== channel) return false
      if (scope === "unread") return conversation.unread > 0 || conversation.id === activeId
      if (scope === "waiting") return conversation.messages.at(-1)?.from === "lead" || conversation.id === activeId
      return true
    })

  const active = items.find((i) => i.conversation.id === activeId) ?? items[0]

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex w-80 shrink-0 flex-col border-r bg-background">
        <div className="border-b p-3">
          <Tabs value={scope} onValueChange={(v) => setScope(v as Scope)}>
            <TabsList className="w-full">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">Não lidas</TabsTrigger>
              <TabsTrigger value="waiting">Aguardando</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ConversationList items={items} activeId={active?.conversation.id} onSelect={setActiveId} channels={connected} channel={channel} onChannel={setChannel} />
      </div>
      {active ? (
        <>
          <div className="flex min-w-0 flex-1 flex-col bg-background">
            <div className="flex h-12 items-center gap-3 border-b px-4">
              <span className="font-medium">{active.lead.name}</span>
              <ChannelTag channel={active.conversation.channel} />
            </div>
            <ChatThread key={active.conversation.id} conversationId={active.conversation.id} />
          </div>
          <LeadSummary lead={active.lead} conversation={active.conversation} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Selecione uma conversa</div>
      )}
    </div>
  )
}
