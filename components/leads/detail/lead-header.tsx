"use client"

import { Flame, Snowflake, ThermometerSun } from "lucide-react"
import { cn } from "@/lib/utils"
import { SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ChannelTag } from "@/components/crm/channel-badge"
import { Initials } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatBRL } from "@/lib/format"
import { stages } from "@/lib/mock/team"
import type { Channel, Lead, Temperature } from "@/lib/mock/types"

const temperatureMeta: Record<Temperature, { label: string; icon: typeof Flame; className: string }> = {
  quente: { label: "Quente", icon: Flame, className: "bg-rose-50 text-rose-700" },
  morno: { label: "Morno", icon: ThermometerSun, className: "bg-amber-50 text-amber-700" },
  frio: { label: "Frio", icon: Snowflake, className: "bg-sky-50 text-sky-700" },
}

export const LeadHeader = ({ lead, channel }: { lead: Lead; channel?: Channel }) => {
  const { moveLead } = useCrm()
  const current = stages.findIndex((s) => s.id === lead.stageId)
  const temp = temperatureMeta[lead.details.temperature]
  const TempIcon = temp.icon

  return (
    <div className="space-y-4 border-b p-4 pr-12">
      <div className="flex flex-wrap items-center gap-3">
        <Initials name={lead.name} className="size-11 text-base" />
        <div className="min-w-0">
          <SheetTitle className="text-lg">{lead.name}</SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-2">
            <span>#{lead.id.toUpperCase()}</span>
            {lead.company && <span>· {lead.company}</span>}
            {channel && <ChannelTag channel={channel} />}
          </SheetDescription>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", temp.className)}>
            <TempIcon className="size-3.5" />
            {temp.label} · score {lead.details.score}
          </span>
          {lead.tags.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
          <span className="text-xl font-semibold tabular-nums">{formatBRL(lead.value)}</span>
        </div>
      </div>

      <div className="flex gap-1">
        {stages.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => moveLead(lead.id, stage.id)}
            title={`Mover para ${stage.name}`}
            className="group flex-1 text-left"
          >
            <div className={cn("h-1.5 rounded-full transition-colors", i <= current ? stage.color : "bg-muted group-hover:bg-muted-foreground/20")} />
            <div className={cn("mt-1 truncate text-[11px]", i === current ? "font-semibold text-foreground" : "text-muted-foreground")}>{stage.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
