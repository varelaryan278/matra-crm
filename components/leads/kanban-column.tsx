"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LeadCard } from "./lead-card"
import { formatBRL } from "@/lib/format"
import type { Conversation, Lead, Stage } from "@/lib/mock/types"

type Props = {
  stage: Stage
  leads: Lead[]
  conversations: Conversation[]
  onDropLead: (leadId: string) => void
  onOpenLead: (leadId: string) => void
}

export const KanbanColumn = ({ stage, leads, conversations, onDropLead, onOpenLead }: Props) => {
  const [over, setOver] = useState(false)
  const total = leads.reduce((sum, l) => sum + l.value, 0)

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        setOver(false)
        const id = e.dataTransfer.getData("text/lead")
        if (id) onDropLead(id)
      }}
      className={cn("flex w-72 shrink-0 flex-col rounded-xl bg-muted/60 transition-colors", over && "bg-primary/10 ring-2 ring-primary/30")}
    >
      <header className="px-3 pt-3 pb-2">
        <div className={cn("mb-2 h-1 rounded-full", stage.color)} />
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold tracking-wide uppercase">{stage.name}</h2>
          <span className="text-xs text-muted-foreground">{leads.length}</span>
        </div>
        <div className="text-xs text-muted-foreground">{formatBRL(total)}</div>
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-3">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            conversation={conversations.find((c) => c.id === lead.conversationId)}
            onOpen={() => onOpenLead(lead.id)}
          />
        ))}
      </div>
    </section>
  )
}
