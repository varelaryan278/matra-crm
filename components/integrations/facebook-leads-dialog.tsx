"use client"

import { ArrowRight, Megaphone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCrm } from "@/lib/crm-store"
import { sellers, stages } from "@/lib/mock/team"
import type { DistributionMode } from "@/lib/mock/types"

const forms = [
  { name: "Implante Dentário - Out/26", leads: 312 },
  { name: "Leads Imobiliária", leads: 187 },
  { name: "Reels Promo Black", leads: 95 },
]

const mapping = [
  ["full_name", "Nome do lead"],
  ["phone_number", "Telefone (WhatsApp)"],
  ["email", "E-mail"],
  ["campaign_name", "Campanha"],
  ["ad_name", "Anúncio"],
]

const modeItems: { value: DistributionMode; label: string }[] = [
  { value: "round_robin", label: "Rodízio entre vendedores" },
  { value: "menor_carga", label: "Quem tem menos leads abertos" },
  { value: "fixo", label: "Sempre para um responsável" },
]

const stageItems = stages.map((s) => ({ value: s.id, label: s.name }))
const sellerItems = sellers.map((s) => ({ value: s.id, label: s.name }))

export const FacebookLeadsDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { distribution, setDistribution, fixedOwnerId, setFixedOwnerId } = useCrm()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="size-5 text-blue-600" />
            Facebook & Instagram Lead Ads
          </DialogTitle>
          <DialogDescription>Todo lead de formulário entra direto no funil, já com responsável. Zero digitação manual.</DialogDescription>
        </DialogHeader>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Formulários sincronizados</h3>
          <div className="divide-y rounded-lg border">
            {forms.map((f) => (
              <div key={f.name} className="flex items-center justify-between px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.leads} leads nos últimos 30 dias</div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">Etapa de entrada</Label>
            <Select items={stageItems} defaultValue="s1">
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {stageItems.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Distribuição</Label>
            <Select items={modeItems} value={distribution} onValueChange={(v) => v && setDistribution(v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {modeItems.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {distribution === "fixo" && (
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs">Responsável fixo</Label>
              <Select items={sellerItems} value={fixedOwnerId} onValueChange={(v) => v && setFixedOwnerId(v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sellerItems.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Mapeamento de campos</h3>
          <div className="divide-y rounded-lg border text-sm">
            {mapping.map(([from, to]) => (
              <div key={from} className="flex items-center gap-3 px-3 py-2">
                <code className="w-36 text-xs text-muted-foreground">{from}</code>
                <ArrowRight className="size-3.5 text-muted-foreground" />
                <span>{to}</span>
              </div>
            ))}
          </div>
        </section>

        <DialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false)
              toast.success("Regras de captação salvas", { description: "Use “Simular lead do Facebook” no topo para testar" })
            }}
          >
            Salvar regras
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
