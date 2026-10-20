"use client"

import { useState } from "react"
import { ArrowLeft, Minus, Plus, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowCanvas } from "./flow-canvas"
import { NodeInspector } from "./node-inspector"
import { AutomationSettings } from "./automation-settings"
import { FlowTester } from "./flow-tester"
import { RunHistory } from "./run-history"
import { useCrm } from "@/lib/crm-store"
import { insertNode, removeNode, updateConfig, type Slot } from "@/lib/automation/flow-ops"
import type { Automation, NodeKind } from "@/lib/mock/types"

type Props = {
  automation: Automation
  onBack: () => void
}

export const FlowEditor = ({ automation, onBack }: Props) => {
  const { saveAutomation } = useCrm()
  const [draft, setDraft] = useState(automation)
  const [dirty, setDirty] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  const [panel, setPanel] = useState("config")
  const [zoom, setZoom] = useState(1)
  const [run, setRun] = useState<{ current?: string; visited: string[] }>({ visited: [] })
  const [seq, setSeq] = useState(0)

  const edit = (next: Automation) => {
    setDraft(next)
    setDirty(true)
  }

  const changePanel = (value: string) => {
    setPanel(value)
    if (value !== "test") setRun({ visited: [] })
  }
  const insert = (parentId: string, slot: Slot, kind: NodeKind) => {
    const id = `${draft.id}-new${seq}`
    setSeq((n) => n + 1)
    edit({ ...draft, flow: insertNode(draft.flow, parentId, slot, kind, id) })
    setSelectedId(id)
    changePanel("config")
  }

  const remove = () => {
    edit({ ...draft, flow: removeNode(draft.flow, selectedId) })
    setSelectedId("")
  }

  const save = () => {
    saveAutomation(draft)
    setDirty(false)
    toast.success("Automação salva", { description: draft.active ? "Ativa e rodando para novos leads" : "Salva como rascunho (desativada)" })
  }



  const selected = selectedId ? draft.flow.nodes[selectedId] : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b bg-background px-4 py-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          Automações
        </Button>
        <Input value={draft.name} onChange={(e) => edit({ ...draft, name: e.target.value })} className="h-8 max-w-sm font-medium" />
        {dirty && <span className="text-xs text-amber-600">Alterações não salvas</span>}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center rounded-lg border">
            <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} aria-label="Diminuir zoom"><Minus /></Button>
            <span className="w-11 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))} aria-label="Aumentar zoom"><Plus /></Button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={draft.active} onCheckedChange={(v) => edit({ ...draft, active: v })} />
            {draft.active ? "Ativa" : "Desativada"}
          </label>
          <Button size="sm" onClick={save}>
            <Save />
            Salvar
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <FlowCanvas
          zoom={zoom}
          flow={draft.flow}
          selectedId={selectedId}
          statusOf={(id) => (run.current === id ? "current" : run.visited.includes(id) ? "done" : undefined)}
          onSelect={(id) => {
            setSelectedId(id)
            if (id && panel !== "test") changePanel("config")
          }}
          onInsert={insert}
        />
        <aside className="flex w-[380px] shrink-0 flex-col border-l bg-background">
          <Tabs value={panel} onValueChange={(v) => changePanel(v as string)} className="min-h-0 flex-1 gap-0">
            <TabsList variant="line" className="w-full justify-start border-b px-3">
              <TabsTrigger value="config" className="flex-none">{selected ? "Bloco" : "Configurar"}</TabsTrigger>
              <TabsTrigger value="test" className="flex-none">Testar</TabsTrigger>
              <TabsTrigger value="runs" className="flex-none">Execuções</TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="overflow-y-auto">
              {selected ? (
                <NodeInspector
                  key={selected.id}
                  node={selected}
                  onChange={(key, value) => edit({ ...draft, flow: updateConfig(draft.flow, selected.id, key, value) })}
                  onDelete={remove}
                />
              ) : (
                <AutomationSettings automation={draft} onDescription={(description) => edit({ ...draft, description })} />
              )}
            </TabsContent>
            <TabsContent value="test" className="overflow-y-auto">
              <FlowTester flow={draft.flow} onProgress={(current, visited) => setRun({ current, visited })} />
            </TabsContent>
            <TabsContent value="runs" className="overflow-y-auto">
              <RunHistory automation={draft} />
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}
