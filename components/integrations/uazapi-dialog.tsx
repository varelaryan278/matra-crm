"use client"

import { useEffect, useState } from "react"
import { CircleCheck, QrCode, RefreshCw, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FakeQr } from "./fake-qr"
import { useCrm } from "@/lib/crm-store"

type Step = "config" | "qr" | "done"

export const UazapiDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { setConnection } = useCrm()
  const [step, setStep] = useState<Step>("config")
  const [seconds, setSeconds] = useState(30)
  const [seed, setSeed] = useState(1)

  useEffect(() => {
    if (step !== "qr") return
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1
        setSeed((n) => n + 1)
        return 30
      })
    }, 1000)
    return () => clearInterval(id)
  }, [step])

  const close = (value: boolean) => {
    onOpenChange(value)
    if (!value) setTimeout(() => setStep("config"), 200)
  }

  const generate = () => {
    setSeconds(30)
    setStep("qr")
  }

  const scanned = () => {
    setStep("done")
    setConnection("wa_uazapi", { status: "connected", phone: "+55 43 99914-0409", detail: "Instância vendas-01" })
    toast.success("Número conectado via uazapi", { description: "Histórico das últimas conversas importado" })
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="size-5 text-teal-600" />
            WhatsApp via uazapi (não oficial)
          </DialogTitle>
          <DialogDescription>Conecta qualquer número lendo o QR Code, como no WhatsApp Web.</DialogDescription>
        </DialogHeader>

        {step === "config" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="srv" className="text-xs">URL do servidor uazapi</Label>
              <Input id="srv" defaultValue="https://matra.uazapi.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tok" className="text-xs">Token da instância</Label>
              <Input id="tok" type="password" defaultValue="uaz_8f2c1d9e" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Nome da instância</Label>
              <Input id="name" defaultValue="vendas-01" />
            </div>
          </div>
        )}

        {step === "qr" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <FakeQr seed={seed} />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="size-3" /> QR expira em {seconds}s
            </div>
            <ol className="w-full space-y-1 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <li>1. Abra o WhatsApp no celular</li>
              <li>2. Toque em <b>Aparelhos conectados</b> → <b>Conectar aparelho</b></li>
              <li>3. Aponte a câmera para este código</li>
            </ol>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CircleCheck className="size-12 text-emerald-500" />
            <div className="font-semibold">Conectado!</div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Smartphone className="size-4" /> +55 43 99914-0409</div>
          </div>
        )}

        <DialogFooter>
          {step === "config" && <Button onClick={generate}>Gerar QR Code</Button>}
          {step === "qr" && <Button onClick={scanned}>Simular leitura do QR</Button>}
          {step === "done" && <Button onClick={() => close(false)}>Concluir</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
