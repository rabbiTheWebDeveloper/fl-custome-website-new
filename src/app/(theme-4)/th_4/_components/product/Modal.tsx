"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import { X } from "lucide-react"

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        onDismiss()
      }
    },
    [onDismiss]
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss()
    },
    [onDismiss]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [onKeyDown])

  return (
    <div
      ref={overlay}
      className="fixed z-50 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60 p-4 md:p-10 overflow-y-auto"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="min-h-full flex items-center justify-center"
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
          {/* Cancel/Close button with Lucide X icon */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {children}
        </div>
      </div>
    </div>
  )
}
