import { cn } from "@/lib/utils"
import type { ConnectionStatus } from "@/lib/mock/types"

const labels: Record<ConnectionStatus, string> = {
  connected: "Conectado",
  connecting: "Conectando...",
  disconnected: "Desconectado",
}

export const StatusPill = ({ status }: { status: ConnectionStatus }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
      status === "connected" && "bg-emerald-50 text-emerald-700",
      status === "connecting" && "bg-amber-50 text-amber-700",
      status === "disconnected" && "bg-muted text-muted-foreground",
    )}
  >
    <span className={cn("size-1.5 rounded-full", status === "connected" ? "bg-emerald-500" : status === "connecting" ? "animate-pulse bg-amber-500" : "bg-muted-foreground/50")} />
    {labels[status]}
  </span>
)
