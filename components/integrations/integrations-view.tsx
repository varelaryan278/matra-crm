"use client"

import { useState } from "react"
import { Megaphone } from "lucide-react"
import { toast } from "sonner"
import { ChannelIcon } from "@/components/crm/channel-badge"
import { IntegrationCard } from "./integration-card"
import { WhatsappComparison } from "./whatsapp-comparison"
import { WhatsappOfficialDialog } from "./whatsapp-official-dialog"
import { UazapiDialog } from "./uazapi-dialog"
import { FacebookLeadsDialog } from "./facebook-leads-dialog"
import { useCrm, type ConnectionKey } from "@/lib/crm-store"

type DialogKey = "official" | "uazapi" | "facebook" | null

export const IntegrationsView = () => {
  const { connections, setConnection } = useCrm()
  const [dialog, setDialog] = useState<DialogKey>(null)

  const disconnect = (key: ConnectionKey, name: string) => {
    setConnection(key, { status: "disconnected" })
    toast(`${name} desconectado`)
  }

  return (
    <div className="flex-1 space-y-8 overflow-y-auto p-6">
      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">WhatsApp</h2>
          <p className="text-sm text-muted-foreground">Conecte pela API oficial da Meta, pela uazapi ou pelas duas ao mesmo tempo. As conversas caem na mesma central.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationCard
            icon={<ChannelIcon channel="wa_official" className="size-6" />}
            title="WhatsApp Business Cloud API"
            badge="Oficial"
            description="Número verificado, templates aprovados e disparos com segurança. Ideal para operação em escala."
            connection={connections.wa_official}
            onConfigure={() => setDialog("official")}
            onDisconnect={() => disconnect("wa_official", "WhatsApp oficial")}
          />
          <IntegrationCard
            icon={<ChannelIcon channel="wa_uazapi" className="size-6" />}
            title="WhatsApp via uazapi"
            badge="Não oficial"
            description="Conecte qualquer número lendo um QR Code. Rápido de ativar, sem aprovação da Meta."
            connection={connections.wa_uazapi}
            onConfigure={() => setDialog("uazapi")}
            onDisconnect={() => disconnect("wa_uazapi", "WhatsApp uazapi")}
          />
        </div>
        <WhatsappComparison />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">Captação de leads</h2>
          <p className="text-sm text-muted-foreground">Leads de anúncios entram sozinhos no funil, sem ninguém digitar.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationCard
            icon={<Megaphone className="size-5 text-blue-600" />}
            title="Facebook & Instagram Lead Ads"
            description="Formulários instantâneos viram leads no funil, com campanha, anúncio e responsável."
            connection={connections.facebook_leads}
            onConfigure={() => setDialog("facebook")}
            onDisconnect={() => disconnect("facebook_leads", "Lead Ads")}
          />
        </div>
      </section>

      <WhatsappOfficialDialog open={dialog === "official"} onOpenChange={(o) => setDialog(o ? "official" : null)} />
      <UazapiDialog open={dialog === "uazapi"} onOpenChange={(o) => setDialog(o ? "uazapi" : null)} />
      <FacebookLeadsDialog open={dialog === "facebook"} onOpenChange={(o) => setDialog(o ? "facebook" : null)} />
    </div>
  )
}
