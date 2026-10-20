"use client"

import { useState } from "react"
import { Check, Clock, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatDate, localNowIso, shiftIso } from "@/lib/format"
import type { Lead } from "@/lib/mock/types"

const dueItems = [
  { value: "60", label: "Em 1 hora" },
  { value: "1440", label: "Amanhã" },
  { value: "4320", label: "Em 3 dias" },
  { value: "10080", label: "Em 1 semana" },
]

export const LeadTasks = ({ lead }: { lead: Lead }) => {
  const { tasks, addTask, toggleTask } = useCrm()
  const [title, setTitle] = useState("")
  const [due, setDue] = useState("1440")
  const list = tasks.filter((t) => t.leadId === lead.id).sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due))

  const submit = () => {
    if (!title.trim()) return
    addTask(lead.id, title.trim(), shiftIso(localNowIso(), Number(due)), lead.ownerId)
    setTitle("")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-2 border-b p-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Nova tarefa, ex.: Ligar para confirmar visita" className="h-8" />
        <Select items={dueItems} value={due} onValueChange={(v) => v && setDue(v)}>
          <SelectTrigger size="sm" className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {dueItems.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={submit} disabled={!title.trim()}>
          <Plus />
          Adicionar
        </Button>
      </div>
      <ul className="flex-1 space-y-2 overflow-y-auto p-4">
        {list.map((task) => {
          const late = !task.done && task.due < localNowIso()
          return (
            <li key={task.id} className={cn("flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5", task.done && "opacity-60")}>
              <button
                onClick={() => toggleTask(task.id)}
                aria-label={task.done ? "Reabrir tarefa" : "Concluir tarefa"}
                className={cn("flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors", task.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40 hover:border-primary")}
              >
                {task.done && <Check className="size-3.5" />}
              </button>
              <span className={cn("flex-1 text-sm", task.done && "line-through")}>{task.title}</span>
              <span className={cn("inline-flex items-center gap-1 text-xs", late ? "font-medium text-rose-600" : "text-muted-foreground")}>
                <Clock className="size-3" />
                {late ? "Atrasada · " : ""}
                {formatDate(task.due)}
              </span>
              <UserAvatar userId={task.ownerId} className="size-5 text-[9px]" />
            </li>
          )
        })}
        {!list.length && <li className="py-8 text-center text-sm text-muted-foreground">Nenhuma tarefa para este lead</li>}
      </ul>
    </div>
  )
}
