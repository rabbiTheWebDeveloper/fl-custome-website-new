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
      className={`fixed bottom-6 right-6 z-[999] flex flex-col gap-3 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {/* Messenger */}
      {messenger && (
        <div className="relative">
          <a
            href={messengerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Chat on Messenger"
            onMouseEnter={() => setIsHovering("messenger")}
            onMouseLeave={() => setIsHovering(null)}
          >
            <MessageSquare size={24} />
          </a>

          <span
            className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
              isHovering === "messenger"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            Messenger
          </span>
        </div>
      )}

      {/* WhatsApp */}
      {formattedWhatsApp && (
        <div className="relative">
          <a
            href={`https://wa.me/${formattedWhatsApp}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Chat on WhatsApp"
            onMouseEnter={() => setIsHovering("whatsapp")}
            onMouseLeave={() => setIsHovering(null)}
          >
            <MessageCircle size={24} />
          </a>

          <span
            className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
              isHovering === "whatsapp"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            WhatsApp
          </span>
        </div>
      )}

      {/* Welcome Bubble (decorative; hidden via opacity to avoid layout shift) */}
      <div
        className={`absolute bottom-full right-0 mb-4 transition-opacity duration-300 ${
          showWelcome ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg relative">
          Chat with us!
          <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
        </div>
      </div>
    </div>
  )
}
