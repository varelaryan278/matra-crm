"use client"

import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FlowPath } from "./flow-path"
import { catalog } from "./catalog"
import { useCrm } from "@/lib/crm-store"
import { formatDate } from "@/lib/format"
import type { Automation } from "@/lib/mock/types"

type Props = {
  onOpen: (a: Automation) => void
  onDuplicate: (a: Automation) => void
}

export const AutomationList = ({ onOpen, onDuplicate }: Props) => {
  const { automations, toggleAutomation, deleteAutomation } = useCrm()

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
          <tr>
            <th className="w-14 px-4 py-2 font-medium">Ativa</th>
            <th className="px-4 py-2 font-medium">Automação</th>
            <th className="px-4 py-2 font-medium">Gatilho</th>
            <th className="px-4 py-2 font-medium">Fluxo</th>
            <th className="px-4 py-2 text-right font-medium">Execuções</th>
            <th className="px-4 py-2 text-right font-medium">Sucesso</th>
            <th className="px-4 py-2 font-medium">Última</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {automations.map((a) => (
            <tr key={a.id} className="hover:bg-muted/30">
              <td className="px-4 py-3"><Switch checked={a.active} onCheckedChange={() => toggleAutomation(a.id)} /></td>
              <td className="px-4 py-3">
                <button onClick={() => onOpen(a)} className="text-left font-medium hover:text-primary">{a.name}</button>
                <div className="text-xs text-muted-foreground">{a.description}</div>
              </td>
              <td className="px-4 py-3 text-xs">{catalog.trigger.summary(a.flow.nodes[a.flow.rootId].config)}</td>
              <td className="px-4 py-3"><FlowPath flow={a.flow} /></td>
              <td className="px-4 py-3 text-right tabular-nums">{a.runs.toLocaleString("pt-BR")}</td>
              <td className="px-4 py-3 text-right tabular-nums">{a.runs ? `${a.successRate.toLocaleString("pt-BR")}%` : "—"}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{a.lastRunAt ? formatDate(a.lastRunAt) : "—"}</td>
              <td className="px-2 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Ações" />}>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onOpen(a)}><Pencil />Editar fluxo</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(a)}><Copy />Duplicar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        deleteAutomation(a.id)
                        toast(`“${a.name}” excluída`)
                      }}
                    >
                      <Trash2 />Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
