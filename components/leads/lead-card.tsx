"use client"

import { cn } from "@/lib/utils"
import { ChannelIcon, SourceTag } from "@/components/crm/channel-badge"
import { UserAvatar } from "@/components/crm/user-avatar"
import { formatBRL } from "@/lib/format"
import type { Conversation, Lead } from "@/lib/mock/types"

type Props = {
  lead: Lead
  conversation?: Conversation
  onOpen: () => void
}

export const LeadCard = ({ lead, conversation, onOpen }: Props) => {
  const last = conversation?.messages.at(-1)
  const isNew = lead.id.startsWith("lnew")

  return (
    <button
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/lead", lead.id)}
      onClick={onOpen}
      className={cn(
        "w-full cursor-grab rounded-lg border bg-card p-3 text-left shadow-xs transition hover:border-primary/40 hover:shadow-sm active:cursor-grabbing",
        isNew && "animate-in fade-in slide-in-from-top-2 ring-2 ring-sky-300",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{lead.name}</div>
          {lead.company && <div className="truncate text-xs text-muted-foreground">{lead.company}</div>}
        </div>
        <UserAvatar userId={lead.ownerId} />
      </div>
      {last && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          {conversation && <ChannelIcon channel={conversation.channel} className="size-4" />}
          <span className="truncate">{last.text}</span>
          {!!conversation?.unread && <span className="ml-auto rounded-full bg-rose-500 px-1.5 text-[10px] leading-4 font-semibold text-white">{conversation.unread}</span>}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between">
        <SourceTag source={lead.source} />
        <span className="text-xs font-semibold">{formatBRL(lead.value)}</span>
      </div>
    </button>
  )
}
