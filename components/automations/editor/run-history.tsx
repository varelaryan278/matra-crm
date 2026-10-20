"use client"

import { CircleCheck, CircleX, Hourglass } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatDate, shiftIso } from "@/lib/format"
import type { Automation } from "@/lib/mock/types"

const statusMeta = {
  ok: { label: "Concluída", icon: CircleCheck, className: "text-emerald-600" },
  waiting: { label: "Em espera", icon: Hourglass, className: "text-amber-600" },
  error: { label: "Erro", icon: CircleX, className: "text-rose-600" },
}

export const RunHistory = ({ automation }: { automation: Automation }) => {
  const { leads } = useCrm()
  if (!automation.runs || !automation.lastRunAt) {
    return <p className="p-6 text-center text-sm text-muted-foreground">Esta automação ainda não rodou.</p>
  }
  const offset = automation.id.length + automation.runs
  const runs = Array.from({ length: 8 }, (_, i) => {
    const lead = leads[(i * 3 + offset) % leads.length]
    const status = i === 3 ? "error" : i === 1 ? "waiting" : "ok"
    const detail = status === "error" ? "Janela de 24h fechada: envie um template HSM" : status === "waiting" ? "Aguardando o próximo passo" : `${3 + (i % 4)} blocos executados`
    return { id: `${automation.id}-run${i}`, lead, status, detail, at: shiftIso(automation.lastRunAt!, -i * 37) } as const
  })

  return (
    <ul className="divide-y">
      {runs.map((run) => {
        const meta = statusMeta[run.status]
        const Icon = meta.icon
        return (
          <li key={run.id} className="flex items-start gap-3 px-4 py-3">
            <Icon className={cn("mt-0.5 size-4 shrink-0", meta.className)} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                {run.lead.name}
                <UserAvatar userId={run.lead.ownerId} className="size-4 text-[8px]" />
              </div>
              <div className="text-xs text-muted-foreground">{run.detail}</div>
            </div>
            <div className="text-right text-[11px] text-muted-foreground">
              <div className={cn("font-medium", meta.className)}>{meta.label}</div>
              {formatDate(run.at)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
