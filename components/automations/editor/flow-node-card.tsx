"use client"

import { Check, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { catalog } from "../catalog"
import type { FlowNode } from "@/lib/mock/types"

export type RunStatus = "current" | "done" | undefined

type Props = {
  node: FlowNode
  selected: boolean
  status: RunStatus
  onSelect: () => void
}

export const FlowNodeCard = ({ node, selected, status, onSelect }: Props) => {
  const meta = catalog[node.kind]
  const Icon = meta.icon
  const hsm = node.kind === "message" && node.config.channel === "WhatsApp Oficial" && node.config.mode === "Template aprovado (HSM)"

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative w-72 rounded-xl border bg-card p-3 text-left shadow-xs transition hover:shadow-md",
        selected && "border-primary ring-2 ring-primary/30",
        status === "current" && "border-primary ring-4 ring-primary/40 animate-pulse",
        status === "done" && "border-emerald-300",
      )}
    >
      {status === "done" && (
        <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
          <Check className="size-3" />
        </span>
      )}
      <div className="flex items-center gap-2">
        <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg text-white", meta.tone)}>
          <Icon className="size-4" />
        </span>
        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{meta.label}</span>
        {hsm && (
          <span className="ml-auto inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            <FileText className="size-3" /> HSM
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-3 text-sm">{meta.summary(node.config)}</p>
    </button>
  )
}
