import { Bot, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { userById } from "@/lib/mock/team"
import type { Message } from "@/lib/mock/types"

export const MessageBubble = ({ message }: { message: Message }) => {
  if (message.from === "system") {
    return (
      <div className="my-2 flex justify-center">
        <span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">{message.text}</span>
      </div>
    )
  }

  const outgoing = message.from !== "lead"
  return (
    <div className={cn("flex", outgoing ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-xs",
          outgoing ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border bg-card",
          message.from === "bot" && "bg-violet-600",
        )}
      >
        {outgoing && (
          <div className="mb-0.5 flex items-center gap-1 text-[10px] font-medium opacity-80">
            {message.from === "bot" ? <><Bot className="size-3" /> Salesbot</> : userById(message.authorId ?? "u5").name}
          </div>
        )}
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div className={cn("mt-0.5 flex items-center justify-end gap-1 text-[10px]", outgoing ? "opacity-70" : "text-muted-foreground")}>
          {message.at}
          {outgoing && <CheckCheck className="size-3" />}
        </div>
      </div>
    </div>
  )
}
