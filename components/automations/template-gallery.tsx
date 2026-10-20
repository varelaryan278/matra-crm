"use client"

import { Bot, Calendar, Clock, Flame, Star, Users, Webhook, Zap } from "lucide-react"
import { FlowPath } from "./flow-path"
import { buildFlow } from "@/lib/automation/flow-ops"
import { templates, type Template } from "@/lib/mock/automations"

const icons = { zap: Zap, users: Users, clock: Clock, bot: Bot, calendar: Calendar, star: Star, flame: Flame, webhook: Webhook }

const previews = Object.fromEntries(templates.map((t) => [t.id, buildFlow(`preview-${t.id}`, t.specs)]))

export const TemplateGallery = ({ onUse }: { onUse: (t: Template) => void }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {templates.map((t) => {
      const Icon = icons[t.icon as keyof typeof icons]
      return (
        <button key={t.id} onClick={() => onUse(t)} className="group flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase">{t.category}</span>
          </div>
          <div>
            <div className="font-medium">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.description}</div>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <FlowPath flow={previews[t.id]} />
            <span className="text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">Usar →</span>
          </div>
        </button>
      )
    })}
  </div>
)
