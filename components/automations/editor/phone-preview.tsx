import { Bot, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export type PhoneMessage = { id: string; from: "bot" | "lead"; text: string; hsm?: string }

type Props = {
  leadName: string
  messages: PhoneMessage[]
  options?: [string, string]
  onOption: (index: 0 | 1) => void
}

export const PhonePreview = ({ leadName, messages, options, onOption }: Props) => (
  <div className="mx-auto w-64 rounded-[2rem] border-[6px] border-slate-800 bg-slate-800 shadow-lg">
    <div className="flex items-center gap-2 rounded-t-[1.6rem] bg-emerald-700 px-3 py-2 text-white">
      <span className="flex size-7 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold">Z</span>
      <div className="leading-tight">
        <div className="text-xs font-semibold">Zuno · Atendimento</div>
        <div className="text-[10px] opacity-80">para {leadName}</div>
      </div>
    </div>
    <div className="flex h-80 flex-col gap-1.5 overflow-y-auto rounded-b-[1.6rem] bg-[#efeae2] p-2">
      {!messages.length && <p className="m-auto text-center text-[11px] text-slate-500">As mensagens do fluxo aparecem aqui</p>}
      {messages.map((m) => (
        <div key={m.id} className={cn("max-w-[85%] rounded-lg px-2 py-1.5 text-[11px] shadow-xs", m.from === "bot" ? "self-end bg-[#d9fdd3]" : "self-start bg-white")}>
          {m.hsm && (
            <div className="mb-0.5 flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
              <FileText className="size-2.5" /> template {m.hsm}
            </div>
          )}
          {m.from === "bot" && !m.hsm && (
            <div className="mb-0.5 flex items-center gap-1 text-[9px] font-semibold text-violet-700">
              <Bot className="size-2.5" /> automação
            </div>
          )}
          {m.text}
        </div>
      ))}
      {options && (
        <div className="mt-1 flex flex-col gap-1 self-end">
          {options.map((o, i) => (
            <button key={o} onClick={() => onOption(i as 0 | 1)} className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-sky-600 shadow-xs hover:bg-sky-50">
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)
