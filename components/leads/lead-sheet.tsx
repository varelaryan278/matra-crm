"use client"

import { useState } from "react"
import { CheckSquare, History, MessageCircle, Paperclip } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatThread } from "@/components/chat/chat-thread"
import { LeadHeader } from "./detail/lead-header"
import { LeadProfile } from "./detail/lead-profile"
import { LeadTimeline } from "./detail/lead-timeline"
import { LeadTasks } from "./detail/lead-tasks"
import { LeadFiles } from "./detail/lead-files"
import { useCrm } from "@/lib/crm-store"

const Count = ({ value }: { value: number }) =>
  value > 0 ? <span className="rounded-full bg-muted px-1.5 text-[10px] leading-4 font-semibold text-muted-foreground">{value}</span> : null

export const LeadSheet = () => {
  const { openLeadId, setOpenLeadId, leads, conversations, events, tasks, files } = useCrm()
  const [tab, setTab] = useState("chat")
  const lead = leads.find((l) => l.id === openLeadId)
  const conversation = conversations.find((c) => c.id === lead?.conversationId)

  const close = (open: boolean) => {
    if (open) return
    setOpenLeadId(null)
    setTab("chat")
  }

  return (
    <Sheet open={!!lead} onOpenChange={close}>
      <SheetContent className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-6xl">
        {lead && (
          <>
            <LeadHeader lead={lead} channel={conversation?.channel} />
            <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[360px_1fr]">
              <div className="overflow-y-auto border-r p-4">
                <LeadProfile lead={lead} />
              </div>
              <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className="min-h-0 gap-0">
                <TabsList variant="line" className="w-full justify-start border-b px-3">
                  <TabsTrigger value="chat" className="flex-none"><MessageCircle />Conversa</TabsTrigger>
                  <TabsTrigger value="history" className="flex-none">
                    <History />Histórico<Count value={events.filter((e) => e.leadId === lead.id).length} />
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="flex-none">
                    <CheckSquare />Tarefas<Count value={tasks.filter((t) => t.leadId === lead.id && !t.done).length} />
                  </TabsTrigger>
                  <TabsTrigger value="files" className="flex-none">
                    <Paperclip />Arquivos<Count value={files.filter((f) => f.leadId === lead.id).length} />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="flex min-h-0 flex-col">
                  {conversation && <ChatThread conversationId={conversation.id} />}
                </TabsContent>
                <TabsContent value="history" className="flex min-h-0 flex-col">
                  <LeadTimeline leadId={lead.id} />
                </TabsContent>
                <TabsContent value="tasks" className="flex min-h-0 flex-col">
                  <LeadTasks lead={lead} />
                </TabsContent>
                <TabsContent value="files" className="flex min-h-0 flex-col">
                  <LeadFiles leadId={lead.id} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
