"use client"

import { MousePointerClick } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/format"
import { countNodes } from "@/lib/automation/flow-ops"
import type { Automation } from "@/lib/mock/types"

export const AutomationSettings = ({ automation, onDescription }: { automation: Automation; onDescription: (v: string) => void }) => {
  const stats = [
    { label: "Execuções", value: automation.runs.toLocaleString("pt-BR") },
    { label: "Sucesso", value: automation.runs ? `${automation.successRate.toLocaleString("pt-BR")}%` : "—" },
    { label: "Blocos", value: String(countNodes(automation.flow)) },
    { label: "Última execução", value: automation.lastRunAt ? formatDate(automation.lastRunAt) : "—" },
  ]

  return (
    <div className="space-y-5 p-4">
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border p-3">
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="text-lg font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Descrição</Label>
        <Textarea value={automation.description} onChange={(e) => onDescription(e.target.value)} className="min-h-20" />
      </div>
      <div className="flex gap-3 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        <MousePointerClick className="size-5 shrink-0 text-primary" />
        <div>
          Clique em um bloco para configurar. Use o <b className="text-foreground">+</b> entre os blocos para inserir mensagens, condições, esperas e ações. Depois, teste o fluxo com um lead real na aba <b className="text-foreground">Testar</b>.
        </div>
      </div>
    </div>
  )
}
