"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { setCookie } from "cookies-next"
import { Globe2 } from "lucide-react"
import { Button } from "../ui/button"

const localeMap: Record<string, { code: string; next: string }> = {
  en: { code: "EN", next: "bn" },
  bn: { code: "বা", next: "en" },
}

export function LanguageSelector() {
  const router = useRouter()
  const locale = useLocale()

  const current = localeMap[locale] ?? localeMap.en

  const handleToggle = () => {
    setCookie("NEXT_LOCALE", current.next, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    })
    router.refresh()
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleToggle}
      className="gap-1 h-7 px-2 rounded-full text-[10px] font-semibold"
      aria-label={`Switch language to ${current.next}`}
    >
      <Globe2 className="size-3.5 text-muted-foreground shrink-0" />
      <span>{current.code}</span>
    </Button>
  )
}
