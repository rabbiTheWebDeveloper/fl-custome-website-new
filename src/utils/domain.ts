import { headers } from "next/headers"

/**
 * Get cleaned domain from request headers
 * Removes "www." if exists
 */
export async function getCleanDomain(): Promise<string> {
  const headerList = await headers()
  const host = headerList.get("host")

  if (!host) {
    throw new Error("Host header not found")
  }

  return host.replace(/^www\./, "")
}
