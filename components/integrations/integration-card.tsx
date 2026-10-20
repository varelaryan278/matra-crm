"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusPill } from "./status-pill"
import type { Connection } from "@/lib/mock/types"

type Props = {
  icon: React.ReactNode
  title: string
  badge?: string
  description: string
  connection: Connection
  onConfigure: () => void
  onDisconnect: () => void
}

export const IntegrationCard = ({ icon, title, badge, description, connection, onConfigure, onDisconnect }: Props) => (
  <Card>
    <CardHeader>
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">{icon}</div>
        <div className="min-w-0 flex-1">
          <CardTitle className="flex flex-wrap items-center gap-2 text-sm">
            {title}
            {badge && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">{badge}</span>}
          </CardTitle>
          <CardDescription className="mt-1 text-xs">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="mt-auto flex-row items-center justify-between gap-2">
      <div className="min-w-0 space-y-1">
        <StatusPill status={connection.status} />
        {connection.status === "connected" && (
          <div className="truncate text-xs text-muted-foreground">{[connection.phone, connection.detail].filter(Boolean).join(" · ")}</div>
        )}
      </div>
      {connection.status === "connected" ? (
        <div className="flex shrink-0 gap-1">
          <Button size="sm" variant="ghost" onClick={onDisconnect}>Desconectar</Button>
          <Button size="sm" variant="outline" onClick={onConfigure}>Configurar</Button>
        </div>
      ) : (
        <Button size="sm" onClick={onConfigure}>Conectar</Button>
      )}
    </CardContent>
  </Card>
)
