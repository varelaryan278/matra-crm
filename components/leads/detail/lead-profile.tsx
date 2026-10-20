"use client"

import { Building2, Cake, IdCard, Mail, MapPin, Phone, Target } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SourceTag } from "@/components/crm/channel-badge"
import { UserAvatar } from "@/components/crm/user-avatar"
import { useCrm } from "@/lib/crm-store"
import { formatDate } from "@/lib/format"
import { users } from "@/lib/mock/team"
import type { Lead } from "@/lib/mock/types"

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-1">
    <h3 className="pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{title}</h3>
    {children}
  </section>
)

const Field = ({ icon: Icon, label, value }: { icon?: typeof Phone; label: string; value?: React.ReactNode }) => (
  <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-1 text-sm">
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {Icon && <Icon className="size-3.5" />}
      {label}
    </span>
    <span className="min-w-0 break-words">{value ?? "—"}</span>
  </div>
)

const userItems = users.map((u) => ({ value: u.id, label: u.name }))

export const LeadProfile = ({ lead }: { lead: Lead }) => {
  const { updateLead } = useCrm()
  const { details } = lead

  return (
    <div className="space-y-6">
      <Section title="Responsável">
        <Select items={userItems} value={lead.ownerId} onValueChange={(v) => v && updateLead(lead.id, { ownerId: v })}>
          <SelectTrigger size="sm" className="w-full">
            <UserAvatar userId={lead.ownerId} className="size-5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {userItems.map((u) => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </Section>

      <Section title="Contato">
        <Field icon={Phone} label="Telefone" value={lead.phone} />
        <Field icon={Mail} label="E-mail" value={lead.email} />
        <Field icon={MapPin} label="Cidade" value={details.city} />
        <Field icon={IdCard} label="CPF/CNPJ" value={details.document} />
        <Field icon={Cake} label="Aniversário" value={details.birthday} />
        {lead.company && <Field icon={Building2} label="Empresa" value={lead.company} />}
      </Section>

      <Section title="Negócio">
        <Field icon={Target} label="Interesse" value={details.interest} />
        <Field label="Criado em" value={formatDate(lead.createdAt)} />
        <Field label="Origem" value={<SourceTag source={lead.source} />} />
      </Section>

      {details.utm && (
        <Section title="Rastreamento do anúncio">
          <div className="rounded-lg border bg-muted/40 px-3 py-1">
            <Field label="utm_source" value={details.utm.source} />
            <Field label="utm_medium" value={details.utm.medium} />
            <Field label="utm_campaign" value={details.utm.campaign} />
            <Field label="utm_content" value={details.utm.content} />
          </div>
        </Section>
      )}

      {details.formAnswers.length > 0 && (
        <Section title="Respostas do formulário">
          <div className="space-y-2">
            {details.formAnswers.map(([q, a]) => (
              <div key={q} className="rounded-lg border px-3 py-2">
                <div className="text-xs text-muted-foreground">{q}</div>
                <div className="text-sm font-medium">{a}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
