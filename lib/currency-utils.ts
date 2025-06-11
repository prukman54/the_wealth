export const CURRENCY_MAP = {
  np: { symbol: "NPR", name: "Nepalese Rupee", code: "NPR" },
  us: { symbol: "$", name: "US Dollar", code: "USD" },
  eu: { symbol: "€", name: "Euro", code: "EUR" },
  uk: { symbol: "£", name: "British Pound", code: "GBP" },
  ca: { symbol: "CAD", name: "Canadian Dollar", code: "CAD" },
  au: { symbol: "AUD", name: "Australian Dollar", code: "AUD" },
  jp: { symbol: "¥", name: "Japanese Yen", code: "JPY" },
  in: { symbol: "₹", name: "Indian Rupee", code: "INR" },
} as const

export function formatCurrency(amount: number, region: string): string {
  const currency = CURRENCY_MAP[region as keyof typeof CURRENCY_MAP] || CURRENCY_MAP.np

  // Handle special formatting for different regions
  switch (region) {
    case "np":
      return `NPR ${amount.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    case "in":
      return `₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    case "jp":
      return `¥ ${amount.toLocaleString("ja-JP", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    default:
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency.code,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)
      } catch {
        return `${currency.symbol} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
  }
}

export function getCurrencySymbol(region: string): string {
  return CURRENCY_MAP[region as keyof typeof CURRENCY_MAP]?.symbol || "NPR"
}

export function getCurrencyCode(region: string): string {
  return CURRENCY_MAP[region as keyof typeof CURRENCY_MAP]?.code || "NPR"
}

export function getCurrencyName(region: string): string {
  return CURRENCY_MAP[region as keyof typeof CURRENCY_MAP]?.name || "Nepalese Rupee"
}
