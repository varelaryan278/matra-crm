"use client"

import { cn } from "@/lib/utils"
import { ChannelIcon } from "@/components/crm/channel-badge"
import { Initials, UserAvatar } from "@/components/crm/user-avatar"
import { channelLabel } from "@/lib/mock/conversations"
import type { Channel, Conversation, Lead } from "@/lib/mock/types"

type Props = {
  items: { conversation: Conversation; lead: Lead }[]
  activeId?: string
  onSelect: (id: string) => void
  channels: Channel[]
  channel: Channel | "all"
  onChannel: (c: Channel | "all") => void
}

export const ConversationList = ({ items, activeId, onSelect, channels, channel, onChannel }: Props) => (
  <div className="flex min-h-0 flex-col">
    <div className="flex flex-wrap gap-1.5 border-b p-3">
      {(["all", ...channels] as const).map((c) => (
        <button
          key={c}
          onClick={() => onChannel(c)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors",
            channel === c ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          {c !== "all" && <ChannelIcon channel={c} className="size-3.5" />}
          {c === "all" ? "Todos" : channelLabel[c]}
        </button>
      ))}
    </div>
    <ul className="flex-1 overflow-y-auto">
      {items.map(({ conversation, lead }) => {
        const last = conversation.messages.at(-1)
        return (
          <li key={conversation.id}>
            <button
              onClick={() => onSelect(conversation.id)}
              className={cn("flex w-full gap-3 border-b px-3 py-3 text-left transition-colors hover:bg-muted/60", activeId === conversation.id && "bg-primary/5")}
            >
              <div className="relative">
                <Initials name={lead.name} />
                <ChannelIcon channel={conversation.channel} className="absolute -right-1 -bottom-1 size-4 ring-2 ring-background" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("truncate text-sm", conversation.unread ? "font-semibold" : "font-medium")}>{lead.name}</span>
                  <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{last?.at}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs text-muted-foreground">{last?.text}</span>
                  {conversation.unread > 0 && (
                    <span className="ml-auto shrink-0 rounded-full bg-rose-500 px-1.5 text-[10px] leading-4 font-semibold text-white">{conversation.unread}</span>
                  )}
                </div>
              </div>
              <UserAvatar userId={lead.ownerId} className="size-5 self-center text-[9px]" />
            </button>
          </li>
        )
      })}
      {!items.length && <li className="p-6 text-center text-sm text-muted-foreground">Nenhuma conversa neste filtro</li>}
    </ul>
  </div>
)
