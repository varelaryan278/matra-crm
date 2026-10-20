"use client"

import { useState } from "react"
import { Clock, FileText, Paperclip, Send, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { approvedTemplates, quickReplies } from "@/lib/mock/conversations"
import { useCrm } from "@/lib/crm-store"
import type { Conversation } from "@/lib/mock/types"

export const Composer = ({ conversation, leadName }: { conversation: Conversation; leadName: string }) => {
  const { sendMessage } = useCrm()
  const [text, setText] = useState("")
  const locked = conversation.channel === "wa_official" && conversation.windowClosed

  const submit = () => {
    if (!text.trim()) return
    sendMessage(conversation.id, text.trim())
    setText("")
  }

  if (locked) {
    return (
      <div className="border-t bg-amber-50 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-amber-800">
          <Clock className="size-4" />
          Janela de 24h encerrada (API oficial). Envie um template aprovado pela Meta para reabrir a conversa.
        </div>
        <div className="flex flex-wrap gap-2">
          {approvedTemplates.map((t) => (
            <Button
              key={t.name}
              size="sm"
              variant="outline"
              className="bg-background"
              onClick={() => sendMessage(conversation.id, t.text.replace("{{1}}", leadName.split(" ")[0]).replace("{{2}}", "10h"))}
            >
              <FileText />
              {t.name}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="border-t bg-background p-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        placeholder="Escreva uma mensagem... (Enter envia)"
        className="min-h-16 resize-none"
      />
      <div className="mt-2 flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Anexar">
          <Paperclip />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
            <Zap />
            Respostas rápidas
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            {quickReplies.map((q) => (
              <DropdownMenuItem key={q} onClick={() => setText(q)}>
                <span className="truncate">{q}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" className="ml-auto" onClick={submit} disabled={!text.trim()}>
          <Send />
          Enviar
        </Button>
      </div>
    </div>
  )
}
