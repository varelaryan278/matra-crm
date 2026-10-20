"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DigitalPipeline } from "./digital-pipeline"
import { AutomationList } from "./automation-list"
import { TemplateGallery } from "./template-gallery"
import { FlowEditor } from "./editor/flow-editor"
import { useCrm } from "@/lib/crm-store"
import { buildFlow, type NodeSpec } from "@/lib/automation/flow-ops"
import type { Automation } from "@/lib/mock/types"

const draftFrom = (name: string, description: string, specs: NodeSpec[]): Automation => {
  const id = `auto-${Date.now()}`
  return { id, name, description, active: false, runs: 0, successRate: 0, flow: buildFlow(id, specs) }
}

export const AutomationsView = () => {
  const { automations } = useCrm()
  const [editing, setEditing] = useState<Automation | null>(null)
  const [tab, setTab] = useState("pipeline")

  if (editing) return <FlowEditor key={editing.id} automation={editing} onBack={() => setEditing(null)} />

  const active = automations.filter((a) => a.active)
  const runs = automations.reduce((s, a) => s + a.runs, 0)
  const success = runs ? automations.reduce((s, a) => s + a.successRate * a.runs, 0) / runs : 0
  const kpis = [
    { label: "Automações ativas", value: `${active.length} de ${automations.length}` },
    { label: "Execuções no mês", value: runs.toLocaleString("pt-BR") },
    { label: "Taxa de sucesso", value: `${success.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` },
    { label: "Tempo economizado", value: `~${Math.round((runs * 2.5) / 60)}h`, hint: "estimando 2,5 min por ação manual" },
  ]

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{k.value}</div>
            {k.hint && <div className="text-[11px] text-muted-foreground">{k.hint}</div>}
          </div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className="gap-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pipeline">Funil digital</TabsTrigger>
            <TabsTrigger value="list">Todas as automações</TabsTrigger>
            <TabsTrigger value="templates">Modelos prontos</TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={() => setEditing(draftFrom("Nova automação", "", [{ kind: "trigger" }]))}>
            <Plus />
            Criar do zero
          </Button>
        </div>
        <TabsContent value="pipeline">
          <p className="mb-3 text-sm text-muted-foreground">O que acontece automaticamente em cada etapa do funil. Clique para editar ou em “Adicionar” para criar uma nova.</p>
          <DigitalPipeline
            onOpen={setEditing}
            onCreate={(trigger, title) => setEditing(draftFrom(`Automação · ${title}`, "", [{ kind: "trigger", config: trigger }]))}
          />
        </TabsContent>
        <TabsContent value="list">
          <AutomationList
            onOpen={setEditing}
            onDuplicate={(a) => setEditing({ ...a, id: `auto-${Date.now()}`, name: `${a.name} (cópia)`, active: false, runs: 0, lastRunAt: undefined })}
          />
        </TabsContent>
        <TabsContent value="templates">
          <TemplateGallery onUse={(t) => setEditing(draftFrom(t.name, t.description, t.specs))} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
