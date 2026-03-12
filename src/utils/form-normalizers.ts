export function normalizeBanglaDigits(value: string): string {
  return value.replace(/[\u09E6-\u09EF]/g, (digit) =>
    String(digit.charCodeAt(0) - 0x09e6)
  )
}

export function normalizePhoneValue(value: string): string {
  return normalizeBanglaDigits(value).trim()
}

export function isValidBangladeshPhone(value: string): boolean {
  const cleaned = normalizePhoneValue(value).replace(/[\s\-\(\)\+]/g, "")
  return /^(880|0)?1[3-9]\d{8}$/.test(cleaned)
}
