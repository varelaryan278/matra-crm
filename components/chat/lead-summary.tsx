"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SourceTag, ChannelTag } from "@/components/crm/channel-badge"
import { Initials, UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatBRL } from "@/lib/format"
import { stageById, userById } from "@/lib/mock/team"
import type { Conversation, Lead } from "@/lib/mock/types"

export const LeadSummary = ({ lead, conversation }: { lead: Lead; conversation: Conversation }) => {
  const { setOpenLeadId } = useCrm()
  const stage = stageById(lead.stageId)

  return (
    <aside className="hidden w-72 shrink-0 space-y-4 overflow-y-auto border-l p-4 xl:block">
      <div className="flex flex-col items-center text-center">
        <Initials name={lead.name} className="size-14 text-lg" />
        <div className="mt-2 font-semibold">{lead.name}</div>
        <div className="text-xs text-muted-foreground">{lead.phone}</div>
        <div className="mt-2"><ChannelTag channel={conversation.channel} /></div>
      </div>
      <dl className="space-y-2 rounded-lg border p-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Etapa</dt>
          <dd className="flex items-center gap-1.5 font-medium"><span className={`size-2 rounded-full ${stage.color}`} />{stage.name}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Valor</dt>
          <dd className="font-medium">{formatBRL(lead.value)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Responsável</dt>
          <dd className="flex items-center gap-1.5 font-medium"><UserAvatar userId={lead.ownerId} className="size-5 text-[9px]" />{userById(lead.ownerId).name}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Origem</dt>
          <dd><SourceTag source={lead.source} /></dd>
        </div>
      </dl>
      <Button variant="outline" className="w-full" onClick={() => setOpenLeadId(lead.id)}>
        <ExternalLink />
        Abrir card do lead
      </Button>
    </aside>
  )
}
