"use client"

import { useState } from "react"
import { ArrowRightLeft, Bot, CheckSquare, Paperclip, PencilLine, Sparkles, StickyNote, UserRoundCog } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatDate } from "@/lib/format"
import { userById } from "@/lib/mock/team"
import type { LeadEventType } from "@/lib/mock/types"

const typeMeta: Record<LeadEventType, { icon: typeof Bot; className: string }> = {
  created: { icon: Sparkles, className: "bg-sky-100 text-sky-700" },
  stage: { icon: ArrowRightLeft, className: "bg-violet-100 text-violet-700" },
  owner: { icon: UserRoundCog, className: "bg-indigo-100 text-indigo-700" },
  comment: { icon: StickyNote, className: "bg-amber-100 text-amber-700" },
  file: { icon: Paperclip, className: "bg-slate-100 text-slate-700" },
  task: { icon: CheckSquare, className: "bg-emerald-100 text-emerald-700" },
  field: { icon: PencilLine, className: "bg-slate-100 text-slate-700" },
  automation: { icon: Bot, className: "bg-fuchsia-100 text-fuchsia-700" },
}

const filters: { id: string; label: string; types?: LeadEventType[] }[] = [
  { id: "all", label: "Tudo" },
  { id: "comment", label: "Comentários", types: ["comment"] },
  { id: "stage", label: "Etapas", types: ["stage"] },
  { id: "audit", label: "Auditoria", types: ["created", "owner", "field", "file", "task", "automation"] },
]

export const LeadTimeline = ({ leadId }: { leadId: string }) => {
  const { events, addComment } = useCrm()
  const [filter, setFilter] = useState("all")
  const [text, setText] = useState("")
  const types = filters.find((f) => f.id === filter)?.types

  const list = events
    .filter((e) => e.leadId === leadId && (!types || types.includes(e.type)))
    .sort((a, b) => b.at.localeCompare(a.at))

  const submit = () => {
    if (!text.trim()) return
    addComment(leadId, text.trim())
    setText("")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 border-b p-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva um comentário interno (só a equipe vê)..."
          className="min-h-16 resize-none bg-amber-50/60"
        />
        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn("rounded-full px-2.5 py-1 text-xs font-medium transition-colors", filter === f.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
            >
              {f.label}
            </button>
          ))}
          <Button size="sm" className="ml-auto" onClick={submit} disabled={!text.trim()}>
            Comentar
          </Button>
        </div>
      </div>

      <ol className="flex-1 overflow-y-auto p-4">
        {list.map((event, i) => {
          const meta = typeMeta[event.type]
          const Icon = meta.icon
          return (
            <li key={event.id} className="relative flex gap-3 pb-5">
              {i < list.length - 1 && <span className="absolute top-8 bottom-0 left-[15px] w-px bg-border" />}
              <span className={cn("z-10 flex size-8 shrink-0 items-center justify-center rounded-full", meta.className)}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {event.authorId ? (
                    <>
                      <UserAvatar userId={event.authorId} className="size-4 text-[8px]" />
                      <span className="font-medium text-foreground">{userById(event.authorId).name}</span>
                    </>
                  ) : (
                    <span className="font-medium text-foreground">Sistema</span>
                  )}
                  <span>{formatDate(event.at)}</span>
                </div>
                {event.type === "comment" ? (
                  <p className="mt-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm">{event.text}</p>
                ) : (
                  <p className="mt-0.5 text-sm">{event.text}</p>
                )}
              </div>
            </li>
          )
        })}
        {!list.length && <li className="py-8 text-center text-sm text-muted-foreground">Nada por aqui ainda</li>}
      </ol>
    </div>
  )
}
