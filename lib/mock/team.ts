import type { Stage, User } from "./types"

export const users: User[] = [
  { id: "u1", name: "Ana Souza", initials: "AS", color: "bg-violet-500", role: "Vendedora" },
  { id: "u2", name: "Bruno Lima", initials: "BL", color: "bg-sky-500", role: "Vendedor" },
  { id: "u3", name: "Carla Mendes", initials: "CM", color: "bg-emerald-500", role: "Vendedora" },
  { id: "u4", name: "Diego Rocha", initials: "DR", color: "bg-amber-500", role: "Vendedor" },
  { id: "u5", name: "Eduarda Alves", initials: "EA", color: "bg-rose-500", role: "Gestora comercial" },
]

export const sellers = users.filter((u) => u.id !== "u5")

export const currentUser = users[4]

export const stages: Stage[] = [
  { id: "s1", name: "Novo lead", color: "bg-sky-400" },
  { id: "s2", name: "Qualificação", color: "bg-violet-400" },
  { id: "s3", name: "Contato feito", color: "bg-amber-400" },
  { id: "s4", name: "Proposta enviada", color: "bg-orange-400" },
  { id: "s5", name: "Negociação", color: "bg-pink-400" },
  { id: "s6", name: "Ganho", color: "bg-emerald-500" },
]

export const userById = (id: string) => users.find((u) => u.id === id) ?? users[0]

export const stageById = (id: string) => stages.find((s) => s.id === id) ?? stages[0]
