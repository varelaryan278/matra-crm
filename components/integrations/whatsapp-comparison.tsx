import { Check, Minus } from "lucide-react"

const rows: [string, string | boolean, string | boolean][] = [
  ["Como conecta", "Token da Meta (Cloud API)", "QR Code no celular"],
  ["Risco de banimento", "Muito baixo", "Existe (uso não oficial)"],
  ["Selo verificado e nome da empresa", true, false],
  ["Templates aprovados (HSM) e disparo em massa", true, false],
  ["Janela de 24h para mensagem livre", "Sim, regra da Meta", "Sem restrição"],
  ["Custo por conversa", "Cobrado pela Meta", "Só a mensalidade da instância"],
  ["Usar número que já está no celular", false, true],
  ["Grupos, status e áudio de voz nativo", false, true],
]

const Cell = ({ value }: { value: string | boolean }) =>
  typeof value === "string" ? <span>{value}</span> : value ? <Check className="size-4 text-emerald-600" /> : <Minus className="size-4 text-muted-foreground" />

export const WhatsappComparison = () => (
  <div className="overflow-hidden rounded-xl border bg-card">
    <table className="w-full text-sm">
      <thead className="bg-muted/60 text-xs">
        <tr>
          <th className="px-4 py-2 text-left font-medium text-muted-foreground">Oficial ou não oficial?</th>
          <th className="px-4 py-2 text-left font-semibold">Cloud API (oficial)</th>
          <th className="px-4 py-2 text-left font-semibold">uazapi (não oficial)</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {rows.map(([label, a, b]) => (
          <tr key={label}>
            <td className="px-4 py-2 text-muted-foreground">{label}</td>
            <td className="px-4 py-2"><Cell value={a} /></td>
            <td className="px-4 py-2"><Cell value={b} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
