import type { StateStorage } from "zustand/middleware"

const MAX_COOKIE_SIZE = 4000 // Leave some room below 4096 limit

function getCookieStore(): CookieStore | null {
  if (typeof window !== "undefined" && "cookieStore" in window) {
    return window.cookieStore
  }
  return null
}

export const createCookieStorage = (
  options: Omit<CookieInit, "name" | "value">
): StateStorage => ({
  getItem: async (name: string) => {
    try {
      const store = getCookieStore()
      if (!store) return null
      const value = await store.get(name)
      if (!value?.value) return null
      // Decode the value
      return decodeURIComponent(value.value)
    } catch (error) {
      console.warn(`Failed to get cookie "${name}":`, error)
      return null
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      const store = getCookieStore()
      if (!store) return

      // Encode the value to handle special characters
      const encodedValue = encodeURIComponent(value)

      // Check if value is too large for a cookie
      if (encodedValue.length > MAX_COOKIE_SIZE) {
        console.warn(
          `Cookie "${name}" value too large (${encodedValue.length} bytes), storing truncated version`
        )
        // For large data, we might need to skip storing or store a minimal version
        // For now, we'll just skip storing if too large
        return
      }

      await store.set({
        name,
        value: encodedValue,
        ...options,
      })
    } catch (error) {
      console.warn(`Failed to set cookie "${name}":`, error)
    }
  },
  removeItem: async (name: string) => {
    try {
      const store = getCookieStore()
      if (!store) return
      await store.delete(name)
    } catch (error) {
      console.warn(`Failed to remove cookie "${name}":`, error)
    }
  },
})
