"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChannelIcon, SourceTag } from "@/components/crm/channel-badge"
import { UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatBRL } from "@/lib/format"
import { channelLabel } from "@/lib/mock/conversations"
import { sellers, stages } from "@/lib/mock/team"
import type { Channel, LeadSource } from "@/lib/mock/types"

const Bar = ({ value, max, className = "bg-primary" }: { value: number; max: number; className?: string }) => (
  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
    <div className={`h-full rounded-full ${className}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
  </div>
)

export const DashboardView = () => {
  const { leads, conversations, connections } = useCrm()
  const won = leads.filter((l) => l.stageId === "s6")
  const open = leads.filter((l) => l.stageId !== "s6")
  const auto = leads.filter((l) => l.source.endsWith("_ads")).length

  const kpis = [
    { label: "Leads no funil", value: String(open.length), hint: `${auto} vieram de anúncios automaticamente` },
    { label: "Pipeline em aberto", value: formatBRL(open.reduce((s, l) => s + l.value, 0)), hint: "Soma das oportunidades" },
    { label: "Receita ganha", value: formatBRL(won.reduce((s, l) => s + l.value, 0)), hint: `${won.length} negócios fechados` },
    { label: "1ª resposta média", value: "1m 42s", hint: "Com bot de boas-vindas ativo" },
  ]

  const byStage = stages.map((s) => ({ ...s, count: leads.filter((l) => l.stageId === s.id).length }))
  const maxStage = Math.max(...byStage.map((s) => s.count))

  const sources = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => ({ ...acc, [l.source]: (acc[l.source] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]) as [LeadSource, number][]

  const channels = (["wa_official", "wa_uazapi", "instagram", "messenger"] as Channel[]).filter((c) => connections[c].status === "connected").map((c) => ({
    channel: c,
    count: conversations.filter((cv) => cv.channel === c).reduce((s, cv) => s + cv.messages.length, 0),
  }))
  const maxChannel = Math.max(...channels.map((c) => c.count))

  const ranking = sellers
    .map((u) => ({ ...u, leads: leads.filter((l) => l.ownerId === u.id).length, won: leads.filter((l) => l.ownerId === u.id && l.stageId === "s6").reduce((s, l) => s + l.value, 0) }))
    .sort((a, b) => b.won - a.won)

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent>
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Funil por etapa</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {byStage.map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className="w-32 shrink-0 truncate">{s.name}</span>
                <Bar value={s.count} max={maxStage} className={s.color} />
                <span className="w-6 text-right tabular-nums">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Ranking da equipe</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {ranking.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-4 text-muted-foreground">{i + 1}</span>
                <UserAvatar userId={u.id} className="size-7" />
                <span className="flex-1">{u.name}</span>
                <span className="text-xs text-muted-foreground">{u.leads} leads</span>
                <span className="w-24 text-right font-medium tabular-nums">{formatBRL(u.won)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Leads por origem</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {sources.map(([source, count]) => (
              <div key={source} className="flex items-center gap-3 text-sm">
                <span className="w-32 shrink-0"><SourceTag source={source} /></span>
                <Bar value={count} max={sources[0][1]} />
                <span className="w-6 text-right tabular-nums">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Mensagens por canal</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {channels.map(({ channel, count }) => (
              <div key={channel} className="flex items-center gap-3 text-sm">
                <span className="flex w-40 shrink-0 items-center gap-2"><ChannelIcon channel={channel} className="size-4" />{channelLabel[channel]}</span>
                <Bar value={count} max={maxChannel} className="bg-emerald-500" />
                <span className="w-6 text-right tabular-nums">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
