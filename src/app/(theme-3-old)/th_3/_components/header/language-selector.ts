"use client"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { setCookie } from "cookies-next"

const languages = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
]

export function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const handleLanguageChange = (newLocale: string) => {
    // 1️⃣ Save locale in cookie
    setCookie("NEXT_LOCALE", newLocale, {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    })

    // 2️⃣ Remove existing locale from path
    const segments = pathname.split("/").filter(Boolean)

    if (segments[0] === locale) {
      segments.shift()
    }

    // 3️⃣ Build new localized path
    const newPath = `/${newLocale}/${segments.join("/")}`

    router.replace(newPath)
  }

  return (
    <select
      id="languageSelector"
      className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      value={locale}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}
