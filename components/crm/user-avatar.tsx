import { cn } from "@/lib/utils"
import { userById } from "@/lib/mock/team"

export const UserAvatar = ({ userId, className }: { userId: string; className?: string }) => {
  const user = userById(userId)
  return (
    <span title={user.name} className={cn("inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white", user.color, className)}>
      {user.initials}
    </span>
  )
}

export const Initials = ({ name, className }: { name: string; className?: string }) => (
  <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary", className)}>
    {name
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0])
      .join("")}
  </span>
)
