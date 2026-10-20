import { BadgeCheck, Camera, Globe, MessageCircle, QrCode, Users, Hand, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Channel, LeadSource } from "@/lib/mock/types"
import { channelLabel } from "@/lib/mock/conversations"
import { sourceLabel } from "@/lib/mock/leads"

const channelStyle: Record<Channel, { icon: typeof MessageCircle; className: string; mark?: typeof BadgeCheck }> = {
  wa_official: { icon: MessageCircle, className: "bg-emerald-500 text-white", mark: BadgeCheck },
  wa_uazapi: { icon: MessageCircle, className: "bg-teal-600 text-white", mark: QrCode },
}

export const ChannelIcon = ({ channel, className }: { channel: Channel; className?: string }) => {
  const { icon: Icon, className: tone, mark: Mark } = channelStyle[channel]
  return (
    <span title={channelLabel[channel]} className={cn("relative inline-flex size-5 shrink-0 items-center justify-center rounded-full", tone, className)}>
      <Icon className="size-3" />
      {Mark && (
        <span className="absolute -right-1 -bottom-1 flex size-3 items-center justify-center rounded-full bg-background">
          <Mark className="size-2.5 text-foreground/70" />
        </span>
      )}
    </span>
  )
}

export const ChannelTag = ({ channel }: { channel: Channel }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
    <ChannelIcon channel={channel} className="size-4" />
    {channelLabel[channel]}
  </span>
)

const sourceIcon: Record<LeadSource, { icon: typeof Megaphone; className: string }> = {
  facebook_ads: { icon: Megaphone, className: "text-blue-600 bg-blue-50" },
  instagram_ads: { icon: Camera, className: "text-pink-600 bg-pink-50" },
  whatsapp: { icon: MessageCircle, className: "text-emerald-600 bg-emerald-50" },
  site: { icon: Globe, className: "text-slate-600 bg-slate-100" },
  indicacao: { icon: Users, className: "text-amber-700 bg-amber-50" },
  manual: { icon: Hand, className: "text-slate-600 bg-slate-100" },
}

export const SourceTag = ({ source, compact }: { source: LeadSource; compact?: boolean }) => {
  const { icon: Icon, className } = sourceIcon[source]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium", className)}>
      <Icon className="size-3" />
      {!compact && sourceLabel[source]}
    </span>
  )
}
