"use client"

import { MessageCircle, MessageSquare } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Props {
  whatsapp?: string | null
  messenger?: string | null
}

export default function FloatingContact({ whatsapp, messenger }: Props) {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const lastScrollYRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  // hide/show on scroll (throttled with rAF, ref for last position)
  useEffect(() => {
    const controlScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        lastScrollYRef.current = currentScrollY
        rafRef.current = null
      })
    }

    window.addEventListener("scroll", controlScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", controlScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // hide welcome bubble after 5s (visual only; stays in DOM to avoid layout shift)
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!whatsapp && !messenger) return null

  // format whatsapp number
  const formattedWhatsApp = whatsapp?.replace(/\D/g, "")

  const message = encodeURIComponent(
    "Hello, I want to know more about your products."
  )

  const messengerLink = messenger?.includes("http")
    ? messenger
    : `https://m.me/${messenger}`

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex flex-col gap-5 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {/* Welcome Bubble (Neumorphism style) */}
      <div
        className={`absolute bottom-full right-0 mb-3 transition-opacity duration-300 ${
          showWelcome ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        <div
          className="text-gray-600 text-sm px-5 py-2.5 rounded-2xl"
          style={{
            backgroundColor: "var(--background)",
            boxShadow: "8px 8px 16px #b8bcc2, -8px -8px 16px #ffffff",
          }}
        >
          👋 Hi! How can we help?
        </div>
      </div>

      {/* Messenger */}
      {messenger && (
        <div className="relative group">
          <a
            href={messengerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-2xl transition-all duration-300 text-[var(--primary)] hover:text-[var(--primary-foreground)]"
            style={{
              backgroundColor: "var(--background)",
              boxShadow: "8px 8px 16px #b8bcc2, -8px -8px 16px #ffffff",
            }}
            aria-label="Chat on Messenger"
            onMouseEnter={() => setIsHovering("messenger")}
            onMouseLeave={() => setIsHovering(null)}
          >
            <MessageSquare size={24} />
          </a>

          <span
            className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
              isHovering === "messenger"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
            style={{
              backgroundColor: "#e0e5ec",
              boxShadow: "5px 5px 10px #b8bcc2, -5px -5px 10px #ffffff",
            }}
          >
            Chat on Messenger
          </span>
        </div>
      )}

      {/* WhatsApp */}
      {formattedWhatsApp && (
        <div className="relative group">
          <a
            href={`https://wa.me/${formattedWhatsApp}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-2xl transition-all duration-300 text-emerald-500 hover:text-emerald-600"
            style={{
              backgroundColor: "#e0e5ec",
              boxShadow: "8px 8px 16px #b8bcc2, -8px -8px 16px #ffffff",
            }}
            aria-label="Chat on WhatsApp"
            onMouseEnter={() => setIsHovering("whatsapp")}
            onMouseLeave={() => setIsHovering(null)}
          >
            <MessageCircle size={24} />
          </a>

          <span
            className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
              isHovering === "whatsapp"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
            style={{
              backgroundColor: "#e0e5ec",
              boxShadow: "5px 5px 10px #b8bcc2, -5px -5px 10px #ffffff",
            }}
          >
            Chat on WhatsApp
          </span>
        </div>
      )}
    </div>
  )
}
