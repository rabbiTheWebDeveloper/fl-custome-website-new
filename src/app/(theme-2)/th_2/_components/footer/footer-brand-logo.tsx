"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { useDomain } from "../../store/domain"

function getLogoUrl(domain: { shop_logo?: unknown } | null): string | null {
  const raw = domain?.shop_logo
  if (typeof raw === "string" && raw.trim() !== "") return raw
  return null
}

export function FooterBrandLogo() {
  const domain = useDomain((state) => state.domain)
  const logoUrl = getLogoUrl(domain)

  return (
    <div className="mb-4 space-y-3">
      <Link href="/" className="block">
        <div className="relative h-12 w-28 overflow-hidden">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={domain?.name || "Brand Logo"}
              fill
              className="object-contain object-left"
            />
          ) : null}
        </div>
      </Link>

      {domain?.shop_meta_description && (
        <p className="text-muted-foreground mb-4">
          {domain?.shop_meta_description}
        </p>
      )}

      {domain?.shop_address && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 mt-0.5 shrink-0" />
          <span>{domain.shop_address}</span>
        </div>
      )}

      {domain?.phone && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="size-4 shrink-0" />
          <a
            href={`tel:${domain.phone}`}
            className="hover:text-primary transition-colors"
          >
            {domain.phone}
          </a>
        </div>
      )}
    </div>
  )
}
