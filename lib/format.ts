const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })

export const formatBRL = (value: number) => brl.format(value)

export const formatDate = (iso: string) => {
  const [date, time] = iso.split("T")
  const [, m, d] = date.split("-")
  return `${d}/${m} ${time.slice(0, 5)}`
}

export const formatDay = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-")
  return `${d}/${m}/${y}`
}

export const formatSize = (bytes: number) =>
  bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`

export const shiftIso = (iso: string, minutes: number) => {
  const d = new Date(`${iso}Z`)
  d.setUTCMinutes(d.getUTCMinutes() + minutes)
  return d.toISOString().slice(0, 19)
}

export const localNowIso = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19)
