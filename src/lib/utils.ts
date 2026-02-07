import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const shopDomain = process.env.NEXT_HOST_NAME || "mhnfamily.com"
export const prepareDomain = (domain: string) => {
  if (domain.startsWith("http://localhost:")) {
    return shopDomain
  }
  return domain
}
