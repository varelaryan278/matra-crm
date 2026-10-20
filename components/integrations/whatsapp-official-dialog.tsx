"use client"

import { useState } from "react"
import { BadgeCheck, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCrm } from "@/lib/crm-store"

const fields = [
  { id: "appId", label: "App ID (Meta for Developers)", placeholder: "1029384756473829" },
  { id: "wabaId", label: "WhatsApp Business Account ID", placeholder: "109283746501928" },
  { id: "phoneId", label: "Phone Number ID", placeholder: "118273645509182" },
  { id: "token", label: "Token de acesso permanente", placeholder: "EAAG..." },
]

export const WhatsappOfficialDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { setConnection } = useCrm()
  const [loading, setLoading] = useState(false)

  const connect = () => {
    setLoading(true)
    setConnection("wa_official", { status: "connecting" })
    setTimeout(() => {
      setConnection("wa_official", { status: "connected", phone: "+55 43 3027-0409", detail: "WABA Matra Comercial · qualidade Alta" })
      setLoading(false)
      onOpenChange(false)
      toast.success("WhatsApp Cloud API conectada", { description: "Webhook verificado e 2 templates sincronizados" })
    }, 1600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeCheck className="size-5 text-emerald-600" />
            WhatsApp Business Cloud API (oficial)
          </DialogTitle>
          <DialogDescription>Conexão direta com a Meta. Requer Business Manager verificado e número dedicado.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.id} className="space-y-1">
              <Label htmlFor={f.id} className="text-xs">{f.label}</Label>
              <Input id={f.id} placeholder={f.placeholder} defaultValue={f.placeholder} type={f.id === "token" ? "password" : "text"} />
            </div>
          ))}
          <div className="rounded-lg bg-muted p-3 text-xs">
            <div className="font-medium">Webhook de retorno</div>
            <code className="text-muted-foreground">https://api.matracrm.app/webhooks/meta/whatsapp</code>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={connect} disabled={loading}>
            {loading && <LoaderCircle className="animate-spin" />}
            {loading ? "Validando com a Meta..." : "Conectar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
