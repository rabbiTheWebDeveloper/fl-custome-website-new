"use client"

import { Button } from "../ui/button"
import {
  Facebook,
  Instagram,
  XIcon,
  YouTube,
  LinkedIn,
  WhatsApp,
} from "../ui/social-icons"
import { useDomain } from "../../store/domain"
import type { ComponentType, SVGProps } from "react"

interface SocialLink {
  key: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  href: string
}

export function FooterSocials() {
  const domain = useDomain((state) => state.domain)

  if (!domain) return null

  const socials = (
    [
      domain.fb ? { key: "facebook", icon: Facebook, href: domain.fb } : null,
      domain.instagram
        ? { key: "instagram", icon: Instagram, href: domain.instagram }
        : null,
      domain.twitter
        ? { key: "twitter", icon: XIcon, href: domain.twitter }
        : null,
      domain.youtube
        ? { key: "youtube", icon: YouTube, href: domain.youtube }
        : null,
      domain.linkedin
        ? { key: "linkedin", icon: LinkedIn, href: domain.linkedin }
        : null,
      domain.whatsapp
        ? {
            key: "whatsapp",
            icon: WhatsApp,
            href: `https://wa.me/${domain.whatsapp.replace(/\D/g, "")}`,
          }
        : null,
    ] as (SocialLink | null)[]
  ).filter((s): s is SocialLink => s !== null && s.href.trim() !== "")

  if (socials.length === 0) return null

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {socials.map((social) => (
        <Button
          key={social.key}
          variant="outline"
          size="icon"
          className="size-10 bg-white"
          asChild
        >
          <a href={social.href} target="_blank" rel="noopener noreferrer">
            <social.icon className="size-5" />
          </a>
        </Button>
      ))}
    </div>
  )
}
