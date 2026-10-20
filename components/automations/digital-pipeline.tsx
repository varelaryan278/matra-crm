"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { FlowPath } from "./flow-path"
import { useCrm } from "@/lib/crm-store"
import { triggerOf } from "@/lib/automation/flow-ops"
import { stages } from "@/lib/mock/team"
import type { Automation } from "@/lib/mock/types"

type Column = { id: string; title: string; color: string; match: (a: Automation) => boolean; trigger: Record<string, string> }

const columns: Column[] = [
  { id: "created", title: "Ao entrar no CRM", color: "bg-slate-400", match: (a) => ["Lead criado", "Formulário do Facebook enviado"].includes(triggerOf(a.flow).event), trigger: { event: "Lead criado" } },
  ...stages.map((s) => ({
    id: s.id,
    title: s.name,
    color: s.color,
    match: (a: Automation) => triggerOf(a.flow).event === "Lead entrou na etapa" && triggerOf(a.flow).stage === s.name,
    trigger: { event: "Lead entrou na etapa", stage: s.name },
  })),
  { id: "other", title: "A qualquer momento", color: "bg-fuchsia-400", match: (a) => ["Mensagem recebida", "Sem resposta do lead", "Tag adicionada", "Horário agendado"].includes(triggerOf(a.flow).event), trigger: { event: "Sem resposta do lead" } },
]

type Props = {
  onOpen: (a: Automation) => void
  onCreate: (trigger: Record<string, string>, title: string) => void
}

export const DigitalPipeline = ({ onOpen, onCreate }: Props) => {
  const { automations, toggleAutomation } = useCrm()

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((col) => {
        const list = automations.filter(col.match)
        return (
          <section key={col.id} className="flex w-64 shrink-0 flex-col rounded-xl bg-muted/60 p-2">
            <header className="px-1 pt-1 pb-2">
              <div className={cn("mb-2 h-1 rounded-full", col.color)} />
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-semibold tracking-wide uppercase">{col.title}</h3>
                <span className="text-xs text-muted-foreground">{list.length}</span>
              </div>
            </header>
            <div className="space-y-2">
              {list.map((a) => (
                <div key={a.id} className={cn("rounded-lg border bg-card p-3 shadow-xs transition hover:border-primary/40", !a.active && "opacity-60")}>
                  <div className="flex items-start gap-2">
                    <button onClick={() => onOpen(a)} className="min-w-0 flex-1 text-left text-sm font-medium hover:text-primary">
                      {a.name}
                    </button>
                    <Switch size="sm" checked={a.active} onCheckedChange={() => toggleAutomation(a.id)} />
                  </div>
                  <div className="mt-2"><FlowPath flow={a.flow} /></div>
                  <div className="mt-2 text-[11px] text-muted-foreground">{a.runs.toLocaleString("pt-BR")} execuções</div>
                </div>
              ))}
              <button
                onClick={() => onCreate(col.trigger, col.title)}
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed py-2 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                <Plus className="size-3.5" />
                Adicionar
              </button>
            </div>
          </section>
        )
      })}
    </div>
  )
}
