"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { setCookie } from "cookies-next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Globe2 } from "lucide-react"

const languages = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
]

export function LanguageSelector() {
  const router = useRouter()
  const locale = useLocale()

  const handleLanguageChange = (newLocale: string) => {
    // Store locale preference in cookie
    setCookie("NEXT_LOCALE", newLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    })

    // Reload the page to apply the new locale
    router.refresh()
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] md:w-[160px] h-10 gap-2">
        <Globe2 className="size-5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
