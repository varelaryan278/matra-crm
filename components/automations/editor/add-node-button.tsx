"use client"

import { Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { addableKinds, catalog, groups } from "../catalog"
import type { NodeKind } from "@/lib/mock/types"

export const AddNodeButton = ({ onPick }: { onPick: (kind: NodeKind) => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label="Adicionar bloco"
      className="z-10 flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-xs transition hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground data-popup-open:border-primary data-popup-open:bg-primary data-popup-open:text-primary-foreground"
    >
      <Plus className="size-3.5" />
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-60">
      {groups.map((group, i) => (
        <DropdownMenuGroup key={group}>
          {i > 0 && <DropdownMenuSeparator />}
          <DropdownMenuLabel>{group}</DropdownMenuLabel>
          {addableKinds
            .filter((k) => catalog[k].group === group)
            .map((kind) => {
              const meta = catalog[kind]
              const Icon = meta.icon
              return (
                <DropdownMenuItem key={kind} onClick={() => onPick(kind)}>
                  <span className={`flex size-5 items-center justify-center rounded text-white ${meta.tone}`}>
                    <Icon className="size-3" />
                  </span>
                  {meta.label}
                </DropdownMenuItem>
              )
            })}
        </DropdownMenuGroup>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)
