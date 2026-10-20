"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./message-bubble"
import { Composer } from "./composer"
import { useCrm } from "@/lib/crm-store"

export const ChatThread = ({ conversationId }: { conversationId: string }) => {
  const { conversations, leads, markRead } = useCrm()
  const conversation = conversations.find((c) => c.id === conversationId)
  const lead = leads.find((l) => l.id === conversation?.leadId)
  const endRef = useRef<HTMLDivElement>(null)
  const count = conversation?.messages.length ?? 0
  const unread = conversation?.unread ?? 0

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [count])

  useEffect(() => {
    if (unread) markRead(conversationId)
  }, [unread, conversationId, markRead])

  if (!conversation || !lead) return null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto bg-muted/40 p-4">
        {conversation.messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>
      <Composer conversation={conversation} leadName={lead.name} />
    </div>
  )
}
