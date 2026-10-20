"use client"

import { useRef, useState } from "react"
import { Download, FileImage, FileSpreadsheet, FileText, File, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatDate, formatSize } from "@/lib/format"
import { userById } from "@/lib/mock/team"

const iconFor = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) return { icon: FileImage, className: "bg-pink-50 text-pink-600" }
  if (["xls", "xlsx", "csv"].includes(ext)) return { icon: FileSpreadsheet, className: "bg-emerald-50 text-emerald-600" }
  if (ext === "pdf") return { icon: FileText, className: "bg-rose-50 text-rose-600" }
  return { icon: File, className: "bg-slate-100 text-slate-600" }
}

export const LeadFiles = ({ leadId }: { leadId: string }) => {
  const { files, addFiles, removeFile } = useCrm()
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const list = files.filter((f) => f.leadId === leadId)

  const handle = (fileList: FileList | null) => {
    if (!fileList?.length) return
    addFiles(leadId, Array.from(fileList, (f) => ({ name: f.name, size: f.size })))
    toast.success(`${fileList.length} arquivo(s) anexado(s)`, { description: "Registrado no histórico do lead" })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
      <button
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          handle(e.dataTransfer.files)
        }}
        className={cn("flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-6 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5", over && "border-primary bg-primary/5")}
      >
        <Upload className="size-5" />
        <span className="font-medium text-foreground">Arraste arquivos ou clique para anexar</span>
        <span className="text-xs">PDF, imagens, planilhas · até 25 MB (simulado, nada é enviado)</span>
      </button>
      <input ref={inputRef} type="file" multiple hidden onChange={(e) => handle(e.target.files)} />

      <ul className="space-y-2">
        {list.map((file) => {
          const { icon: Icon, className } = iconFor(file.name)
          return (
            <li key={file.id} className="group flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", className)}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {formatSize(file.size)} · <UserAvatar userId={file.authorId} className="size-3.5 text-[7px]" /> {userById(file.authorId).name} · {formatDate(file.at)}
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" aria-label="Baixar" onClick={() => toast("Download simulado", { description: file.name })}>
                <Download />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Remover" className="text-muted-foreground hover:text-destructive" onClick={() => removeFile(file.id)}>
                <Trash2 />
              </Button>
            </li>
          )
        })}
        {!list.length && <li className="py-6 text-center text-sm text-muted-foreground">Nenhum arquivo anexado</li>}
      </ul>
    </div>
  )
}
