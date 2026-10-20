import type { LeadDetails, LeadSource } from "./types"

const cities = ["Londrina - PR", "São Paulo - SP", "Curitiba - PR", "Maringá - PR", "Rio de Janeiro - RJ", "Cambé - PR"]
const interests = ["Implante dentário", "Apartamento 2 quartos", "Plano anual", "Consultoria comercial", "Pacote premium", "Clareamento"]
const hours = ["Manhã", "Tarde", "Noite"]

type Base = { source: LeadSource; campaign?: string; adName?: string; tags: string[] }

export const buildDetails = ({ source, campaign, adName, tags }: Base, i: number): LeadDetails => {
  const interest = interests[i % interests.length]
  const temperature = tags.includes("quente") || tags.includes("decisor") ? "quente" : i % 3 === 0 ? "morno" : "frio"
  return {
    city: cities[i % cities.length],
    document: `${String(120 + i * 37).padStart(3, "0")}.***.***-${String(10 + i * 3).slice(-2)}`,
    birthday: `${String((i * 7) % 28 + 1).padStart(2, "0")}/${String((i * 5) % 12 + 1).padStart(2, "0")}`,
    interest,
    temperature,
    score: temperature === "quente" ? 82 + (i % 15) : temperature === "morno" ? 55 + (i % 20) : 25 + (i % 25),
    utm: campaign
      ? { source: source === "instagram_ads" ? "instagram" : "facebook", medium: "paid_social", campaign, content: adName }
      : undefined,
    formAnswers: campaign
      ? [
          ["Qual seu principal interesse?", interest],
          ["Melhor horário para contato?", hours[i % hours.length]],
          ["Já é nosso cliente?", i % 4 === 0 ? "Sim" : "Não"],
        ]
      : [],
  }
}
