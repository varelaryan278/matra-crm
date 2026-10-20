"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ChevronsUpDown, Columns3, MessagesSquare, Plug, Workflow } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCrm } from "@/lib/crm-store"
import { ChannelIcon } from "@/components/crm/channel-badge"
import { channelLabel } from "@/lib/mock/conversations"
import type { Channel } from "@/lib/mock/types"

const items = [
  { href: "/dashboard", label: "Painel", icon: BarChart3 },
  { href: "/leads", label: "Leads", icon: Columns3 },
  { href: "/chats", label: "Chats", icon: MessagesSquare },
  { href: "/automacoes", label: "Automações", icon: Workflow },
  { href: "/integracoes", label: "Integrações", icon: Plug },
]

const channels: Channel[] = ["wa_official", "wa_uazapi"]

export const AppSidebar = () => {
  const pathname = usePathname()
  const { conversations, connections } = useCrm()
  const unread = conversations.reduce((sum, c) => sum + c.unread, 0)

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <button className="m-3 flex items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-muted">
        <span className="size-8 shrink-0 overflow-hidden rounded-lg">
          <Image src="/logo-icon.png" alt="Zuno" width={64} height={64} className="size-full scale-[1.25]" loading="eager" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-sm font-semibold text-foreground">Zuno</span>
          <span className="block truncate text-[11px]">Equipe Comercial</span>
        </span>
        <ChevronsUpDown className="size-4 opacity-60" />
      </button>

      <nav className="flex flex-col gap-0.5 px-3">
        <span className="px-2 pt-2 pb-1 text-[10px] font-semibold tracking-wider uppercase opacity-70">Menu</span>
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                active && "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
              {href === "/chats" && unread > 0 && (
                <span className="ml-auto min-w-5 rounded-full bg-sidebar-primary px-1.5 text-center text-[11px] leading-5 font-semibold text-white">{unread}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-3 pb-16">
        <span className="block px-2 pb-1 text-[10px] font-semibold tracking-wider uppercase opacity-70">Canais</span>
        <div className="space-y-0.5">
          {channels.map((c) => {
            const on = connections[c].status === "connected"
            return (
              <Link key={c} href="/integracoes" className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-muted">
                <ChannelIcon channel={c} className={cn("size-4", !on && "opacity-40 grayscale")} />
                <span className={cn("flex-1 truncate", on ? "text-foreground" : "opacity-60")}>{channelLabel[c]}</span>
                <span className={cn("size-1.5 rounded-full", on ? "bg-emerald-500" : "bg-muted-foreground/30")} />
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
