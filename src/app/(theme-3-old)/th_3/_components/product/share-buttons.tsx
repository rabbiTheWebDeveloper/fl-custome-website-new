"use client"

import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  Check,
  MessageCircle,
  Send,
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

const tooltipClass =
  "absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"

interface ShareButtonsProps {
  title?: string
  url?: string
  className?: string
  compact?: boolean
}

export default function ShareButtons({
  title,
  url,
  className = "",
  compact = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState(url ?? "")

  useEffect(() => {
    const value = url || window.location.href
    queueMicrotask(() => setShareUrl(value))
  }, [url])

  const shareText = title || "Check this out!"

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Couldn't copy the link. Please copy it manually.")
    }
  }

  const platforms = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "#1877f2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "#0A66C2",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "#26A5E4",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Gmail",
      icon: Mail,
      color: "#EA4335",
      url: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`,
    },
  ]

  const openShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400,noopener,noreferrer")
  }

  const buttonSize = compact ? "p-2" : "p-2.5"
  const iconSize = compact ? 16 : 18
  const shareButtonClass = `${buttonSize} rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 group relative`

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {platforms.map((platform) => (
        <button
          type="button"
          key={platform.name}
          onClick={() => openShare(platform.url)}
          className={shareButtonClass}
          style={{ backgroundColor: platform.color }}
          aria-label={`Share on ${platform.name}`}
          title={platform.name}
        >
          <platform.icon size={iconSize} className="text-white" />

          {/* Tooltip */}
          <span className={tooltipClass}>{platform.name}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={handleCopyLink}
        className={`${buttonSize} rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 active:scale-95 bg-gray-100 dark:bg-gray-800 group relative`}
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? (
          <Check size={iconSize} className="text-green-500" />
        ) : (
          <Link2 size={iconSize} className="text-gray-600 dark:text-gray-400" />
        )}

        {/* Tooltip */}
        <span className={tooltipClass}>{copied ? "Copied!" : "Copy link"}</span>
      </button>
    </div>
  )
}
