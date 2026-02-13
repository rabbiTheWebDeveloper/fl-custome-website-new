import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const shopDomain =
  process.env.NEXT_PUBLIC_HOST_NAME ?? "theme.funnelliner.store"
export const prepareDomain = (domain: string) => {
  if (domain.startsWith("http://localhost:")) {
    return shopDomain
  }
  try {
    const url = new URL(domain)
    console.log(url.hostname)
    return url.hostname
  } catch {
    // Fallback: strip protocol, path, query, and trailing slashes
    return domain.replace(/^https?:\/\//, "").split(/[/?#]/)[0]
  }
}
