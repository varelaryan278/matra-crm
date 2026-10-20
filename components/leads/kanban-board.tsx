"use client"

import { useState } from "react"
import { Filter, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KanbanColumn } from "./kanban-column"
import { useCrm } from "@/lib/crm-store"
import { formatBRL } from "@/lib/format"
import { stages, users } from "@/lib/mock/team"

const ownerItems = [{ value: "all", label: "Todos os responsáveis" }, ...users.map((u) => ({ value: u.id, label: u.name }))]

export const KanbanBoard = () => {
  const { leads, conversations, moveLead, setOpenLeadId } = useCrm()
  const [owner, setOwner] = useState("all")
  const [query, setQuery] = useState("")

  const visible = leads.filter(
    (l) => (owner === "all" || l.ownerId === owner) && l.name.toLowerCase().includes(query.toLowerCase()),
  )
  const automatic = leads.filter((l) => l.source.endsWith("_ads")).length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b bg-background px-6 py-3">
        <div className="text-sm">
          <span className="font-semibold">{visible.length} leads</span>
          <span className="text-muted-foreground"> · {formatBRL(visible.reduce((s, l) => s + l.value, 0))}</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          <Zap className="size-3" />
          {automatic} entraram automaticamente via anúncios
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar por nome" className="h-8 w-48" />
          <Select items={ownerItems} value={owner} onValueChange={(v) => v && setOwner(v)}>
            <SelectTrigger size="sm" className="w-52">
              <Filter className="size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ownerItems.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm">
            <Plus />
            Novo lead
          </Button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            leads={visible.filter((l) => l.stageId === stage.id)}
            conversations={conversations}
            onDropLead={(id) => moveLead(id, stage.id)}
            onOpenLead={setOpenLeadId}
          />
        ))}
      </div>
    </div>
  )
}
