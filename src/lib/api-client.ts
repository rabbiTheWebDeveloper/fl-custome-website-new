import { TypedApiClient } from "./api"

const getClientToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

const getServerToken = (): string | null => {
  return null
}

// Create different instances for different contexts
export const clientApi = new TypedApiClient(
  {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  },
  {
    tokenProvider: getClientToken,
  }
)

export const serverApi = new TypedApiClient(
  {
    baseUrl:
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000/api",
  },
  {
    tokenProvider: getServerToken,
  }
)

// For convenience, export a context-aware API
export const api = typeof window === "undefined" ? serverApi : clientApi
