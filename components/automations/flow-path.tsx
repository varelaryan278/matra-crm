import { ChevronRight, GitBranch } from "lucide-react"
import { catalog } from "./catalog"
import { countBranches, mainPath } from "@/lib/automation/flow-ops"
import type { Flow } from "@/lib/mock/types"

export const FlowPath = ({ flow }: { flow: Flow }) => {
  const branches = countBranches(flow)
  return (
    <div className="flex flex-wrap items-center gap-1">
      {mainPath(flow).map((node, i) => {
        const meta = catalog[node.kind]
        const Icon = meta.icon
        return (
          <span key={node.id} className="inline-flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3 text-muted-foreground" />}
            <span title={meta.label} className={`flex size-5 items-center justify-center rounded text-white ${meta.tone}`}>
              <Icon className="size-3" />
            </span>
          </span>
        )
      })}
      {branches > 0 && (
        <span className="ml-1 inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
          <GitBranch className="size-3" />
          {branches}
        </span>
      )}
    </div>
  )
}
