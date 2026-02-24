"use client"

import { Facebook, Twitter, Smartphone } from "lucide-react"
import { useRef } from "react"

interface ShareButtonsProps {
  title?: string
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const shareUrlRef = useRef<string>(
    typeof window !== "undefined" ? window.location.href : ""
  )
  const shareUrl = shareUrlRef.current

  const shareText: string = title || "Check this out!"

  const openShare = (url: string): void => {
    // Use try-catch to handle popup blockers
    try {
      const popup = window.open(
        url,
        "_blank",
        "width=600,height=400,noopener,noreferrer"
      )
      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        // Popup was blocked, fallback to regular window open
        window.open(url, "_blank", "noopener,noreferrer")
      }
    } catch (error) {
      console.error("Error opening share window:", error)
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleFacebook = (): void => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`
    openShare(url)
  }

  const handleWhatsApp = (): void => {
    openShare(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    )
  }

  const handleTwitter = (): void => {
    openShare(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`
    )
  }

  return (
    <div className="flex items-center gap-4 pt-4">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Share:
      </span>

      <div className="flex gap-2">
        <button
          onClick={handleFacebook}
          className="p-2 bg-[#1877f2] text-white rounded-full hover:scale-110 transition"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <Facebook size={18} />
        </button>

        <button
          onClick={handleWhatsApp}
          className="p-2 bg-[#25D366] text-white rounded-full hover:scale-110 transition"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <Smartphone size={18} />
        </button>

        <button
          onClick={handleTwitter}
          className="p-2 bg-[#1DA1F2] text-white rounded-full hover:scale-110 transition"
          aria-label="Share on Twitter"
          title="Share on Twitter"
        >
          <Twitter size={18} />
        </button>
      </div>
    </div>
  )
}
