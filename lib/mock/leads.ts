import type { Lead, LeadSource } from "./types"
import { buildDetails } from "./lead-profile"

type Seed = [string, string | undefined, string, number, string, string, LeadSource, string | undefined, string[], string]

const seeds: Seed[] = [
  ["Mariana Costa", "Clínica Sorriso", "+55 43 99812-4410", 4800, "s1", "u1", "facebook_ads", "Implante Dentário - Out/26", ["quente"], "2026-10-19T08:12:00"],
  ["Rafael Nogueira", undefined, "+55 11 98744-2031", 2500, "s1", "u2", "instagram_ads", "Reels Promo Black", [], "2026-10-19T07:55:00"],
  ["Juliana Prado", "Prado Imóveis", "+55 41 99654-1200", 12000, "s1", "u3", "facebook_ads", "Leads Imobiliária", ["imóveis"], "2026-10-18T19:40:00"],
  ["Thiago Martins", undefined, "+55 43 98832-5571", 1800, "s1", "u4", "whatsapp", undefined, [], "2026-10-18T17:22:00"],
  ["Fernanda Ribeiro", "Studio FR", "+55 21 99120-8834", 3200, "s2", "u1", "facebook_ads", "Implante Dentário - Out/26", ["retorno"], "2026-10-17T10:05:00"],
  ["Lucas Andrade", "Andrade Transportes", "+55 43 99701-3345", 18500, "s2", "u2", "site", undefined, ["b2b"], "2026-10-16T14:30:00"],
  ["Patrícia Gomes", undefined, "+55 44 98810-7712", 2200, "s2", "u3", "instagram_ads", "Reels Promo Black", [], "2026-10-16T09:12:00"],
  ["Gustavo Henrique", "GH Academia", "+55 43 99933-1028", 7600, "s3", "u4", "facebook_ads", "Leads Imobiliária", ["quente"], "2026-10-15T16:48:00"],
  ["Camila Duarte", undefined, "+55 11 97765-4490", 3900, "s3", "u1", "indicacao", undefined, ["indicação"], "2026-10-14T11:20:00"],
  ["Rodrigo Teixeira", "RT Engenharia", "+55 43 99112-6670", 25000, "s3", "u2", "facebook_ads", "Implante Dentário - Out/26", ["b2b", "decisor"], "2026-10-13T15:02:00"],
  ["Aline Ferreira", "Doce Aline", "+55 43 98456-2219", 5400, "s4", "u3", "instagram_ads", "Reels Promo Black", [], "2026-10-12T10:40:00"],
  ["Marcos Vinícius", undefined, "+55 41 99221-0083", 9800, "s4", "u4", "whatsapp", undefined, ["retorno"], "2026-10-11T18:15:00"],
  ["Beatriz Lopes", "Lopes Advocacia", "+55 43 99887-4521", 14200, "s5", "u1", "facebook_ads", "Leads Imobiliária", ["decisor"], "2026-10-09T09:30:00"],
  ["Felipe Cardoso", "Cardoso Auto", "+55 11 98123-7766", 21000, "s5", "u2", "site", undefined, ["b2b"], "2026-10-08T13:10:00"],
  ["Larissa Moura", undefined, "+55 43 99654-8890", 4100, "s6", "u3", "facebook_ads", "Implante Dentário - Out/26", [], "2026-10-05T10:00:00"],
  ["Vinícius Barros", "Barros & Cia", "+55 43 99011-2345", 16800, "s6", "u4", "indicacao", undefined, ["b2b"], "2026-10-03T16:25:00"],
]

const adNames: Record<string, string> = {
  "Implante Dentário - Out/26": "Carrossel antes/depois",
  "Reels Promo Black": "Reels 15s oferta",
  "Leads Imobiliária": "Formulário instantâneo - Apto 2Q",
}

export const seedLeads: Lead[] = seeds.map(([name, company, phone, value, stageId, ownerId, source, campaign, tags, createdAt], i) => ({
  id: `l${i + 1}`,
  name,
  company,
  phone,
  email: `${name.split(" ")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}@email.com`,
  value,
  stageId,
  ownerId,
  source,
  campaign,
  adName: campaign ? adNames[campaign] : undefined,
  tags,
  createdAt,
  conversationId: `c${i + 1}`,
  details: buildDetails({ source, campaign, adName: campaign ? adNames[campaign] : undefined, tags }, i),
}))

export const incomingPool: Omit<Lead, "id" | "stageId" | "ownerId" | "createdAt" | "conversationId" | "tags" | "details">[] = [
  { name: "Renata Silveira", phone: "+55 43 99876-1122", value: 3500, source: "facebook_ads", campaign: "Implante Dentário - Out/26", adName: "Carrossel antes/depois", email: "renata@email.com" },
  { name: "Otávio Mendes", company: "Mendes Contabilidade", phone: "+55 11 98222-3311", value: 8900, source: "facebook_ads", campaign: "Leads Imobiliária", adName: "Formulário instantâneo - Apto 2Q", email: "otavio@email.com" },
  { name: "Sabrina Torres", phone: "+55 41 99345-7788", value: 2700, source: "instagram_ads", campaign: "Reels Promo Black", adName: "Reels 15s oferta", email: "sabrina@email.com" },
  { name: "Henrique Paiva", company: "Paiva Solar", phone: "+55 43 99901-4567", value: 19500, source: "facebook_ads", campaign: "Leads Imobiliária", adName: "Formulário instantâneo - Apto 2Q", email: "henrique@email.com" },
  { name: "Isabela Rocha", phone: "+55 44 98712-9900", value: 4300, source: "facebook_ads", campaign: "Implante Dentário - Out/26", adName: "Carrossel antes/depois", email: "isabela@email.com" },
]

export const sourceLabel: Record<LeadSource, string> = {
  facebook_ads: "Facebook Ads",
  instagram_ads: "Instagram Ads",
  whatsapp: "WhatsApp",
  site: "Site",
  indicacao: "Indicação",
  manual: "Manual",
}
