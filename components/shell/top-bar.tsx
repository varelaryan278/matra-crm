"use client"

import { Bell, Megaphone, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { currentUser, stageById, userById } from "@/lib/mock/team"

export const TopBar = ({ title }: { title: string }) => {
  const { simulateFacebookLead, setOpenLeadId } = useCrm()

  const handleSimulate = () => {
    const { lead, welcome } = simulateFacebookLead()
    toast.success(`Novo lead: ${lead.name}`, {
      description: `${lead.campaign} → ${stageById(lead.stageId).name} · responsável ${userById(lead.ownerId).name}${welcome ? " · boas-vindas enviada" : ""}`,
      action: { label: "Abrir", onClick: () => setOpenLeadId(lead.id) },
    })
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="relative ml-4 hidden max-w-sm flex-1 md:block">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar leads, contatos, conversas..." className="pl-8" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleSimulate}>
          <Megaphone />
          Simular lead do Facebook
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Notificações">
          <Bell />
        </Button>
        <div className="flex items-center gap-2 pl-2">
          <UserAvatar userId={currentUser.id} className="size-8 text-xs" />
          <div className="hidden text-xs leading-tight lg:block">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-muted-foreground">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
