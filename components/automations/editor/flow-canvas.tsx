"use client"

import { cn } from "@/lib/utils"
import { AddNodeButton } from "./add-node-button"
import { FlowNodeCard, type RunStatus } from "./flow-node-card"
import { catalog } from "../catalog"
import { isBranching, type Slot } from "@/lib/automation/flow-ops"
import type { Flow, NodeKind } from "@/lib/mock/types"

type Ctx = {
  flow: Flow
  selectedId?: string
  statusOf: (id: string) => RunStatus
  onSelect: (id: string) => void
  onInsert: (parentId: string, slot: Slot, kind: NodeKind) => void
}

const Line = ({ className }: { className?: string }) => <div className={cn("h-5 w-px bg-border", className)} />

const Branch = ({ id, parentId, slot, ctx }: { id?: string; parentId: string; slot: Slot; ctx: Ctx }) => (
  <div className="flex flex-col items-center">
    <Line />
    <AddNodeButton onPick={(kind) => ctx.onInsert(parentId, slot, kind)} />
    <Line />
    {id ? <NodeTree id={id} ctx={ctx} /> : <span className="rounded-full border border-dashed px-2 py-0.5 text-[10px] text-muted-foreground">Fim</span>}
  </div>
)

const NodeTree = ({ id, ctx }: { id: string; ctx: Ctx }) => {
  const node = ctx.flow.nodes[id]
  const meta = catalog[node.kind]

  return (
    <div className="flex flex-col items-center">
      <FlowNodeCard node={node} selected={ctx.selectedId === id} status={ctx.statusOf(id)} onSelect={() => ctx.onSelect(id)} />
      {isBranching(node.kind) ? (
        <>
          <Line />
          <div className="flex items-start">
            {(["yes", "no"] as const).map((slot, i) => {
              const label = meta.branches?.(node.config)[i]
              return (
                <div key={slot} className="relative flex flex-col items-center px-6">
                  <div className={cn("absolute top-0 h-px bg-border", i === 0 ? "right-0 left-1/2" : "right-1/2 left-0")} />
                  <Line className="h-4" />
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>{label}</span>
                  <Branch id={node[slot]} parentId={id} slot={slot} ctx={ctx} />
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <Branch id={node.next} parentId={id} slot="next" ctx={ctx} />
      )}
    </div>
  )
}

export const FlowCanvas = ({ zoom, ...ctx }: Ctx & { zoom: number }) => (
  <div
    className="min-h-0 flex-1 overflow-auto bg-muted/40"
    style={{ backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
    onClick={(e) => e.target === e.currentTarget && ctx.onSelect("")}
  >
    <div className="flex min-w-max justify-center p-10" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
      <NodeTree id={ctx.flow.rootId} ctx={ctx} />
    </div>
  </div>
)
