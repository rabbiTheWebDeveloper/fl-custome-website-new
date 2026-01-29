import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

export default getRequestConfig(async () => {
  // Get locale from cookie, default to "en"
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "bn"

  // Use explicit imports instead of dynamic template literals
  let messages
  if (locale === "bn") {
    messages = (await import("@/messages/bn.json")).default
  } else {
    messages = (await import("@/messages/en.json")).default
  }

  return {
    locale,
    messages,
  }
})
