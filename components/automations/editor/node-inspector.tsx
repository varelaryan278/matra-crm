"use client"

import { Info, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { catalog, variables, type FieldDef } from "../catalog"
import type { FlowNode } from "@/lib/mock/types"

type Props = {
  node: FlowNode
  onChange: (key: string, value: string) => void
  onDelete: () => void
}

const FieldInput = ({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) => {
  if (field.type === "select") {
    const items = (field.options ?? []).map((o) => ({ value: o, label: o }))
    return (
      <Select items={items} value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {items.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    )
  }
  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-24" />
        {field.variables && (
          <div className="flex flex-wrap gap-1">
            {variables.map((v) => (
              <button key={v} onClick={() => onChange(`${value}${value.endsWith(" ") || !value ? "" : " "}${v}`)} className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/20">
                {v}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
  return <Input value={value} onChange={(e) => onChange(e.target.value)} />
}

export const NodeInspector = ({ node, onChange, onDelete }: Props) => {
  const meta = catalog[node.kind]
  const Icon = meta.icon
  const fields = meta.fields.filter((f) => !f.showIf || f.showIf(node.config))
  const officialFree = node.kind === "message" && node.config.channel === "WhatsApp Oficial" && node.config.mode === "Texto livre"

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center gap-2">
        <span className={`flex size-8 items-center justify-center rounded-lg text-white ${meta.tone}`}>
          <Icon className="size-4" />
        </span>
        <div>
          <div className="text-sm font-semibold">{meta.label}</div>
          <div className="text-xs text-muted-foreground">{meta.group}</div>
        </div>
        {node.kind !== "trigger" && (
          <Button variant="ghost" size="icon-sm" className="ml-auto text-muted-foreground hover:text-destructive" onClick={onDelete} aria-label="Excluir bloco">
            <Trash2 />
          </Button>
        )}
      </div>

      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label className="text-xs">{field.label}</Label>
          <FieldInput field={field} value={node.config[field.key] ?? ""} onChange={(v) => onChange(field.key, v)} />
        </div>
      ))}

      {officialFree && (
        <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          <Info className="size-4 shrink-0" />
          Na API oficial, texto livre só é entregue se o lead falou com você nas últimas 24h. Fora disso, use um template aprovado.
        </div>
      )}
      {node.kind === "condition" || node.kind === "question" ? (
        <p className="text-xs text-muted-foreground">Este bloco divide o fluxo em dois caminhos. Use o “+” abaixo de cada saída para continuar.</p>
      ) : null}
    </div>
  )
}
