import type { StateStorage } from "zustand/middleware"

export const createCookieStorage = (
  options: Omit<CookieInit, "name" | "value">
): StateStorage => ({
  getItem: async (name: string) => {
    const value = await cookieStore.get(name)
    return value?.value || null
  },
  setItem: async (name: string, value: string) => {
    await cookieStore.set({
      name,
      value,
      ...options,
    })
  },
  removeItem: async (name: string) => {
    await cookieStore.delete(name)
  },
})
