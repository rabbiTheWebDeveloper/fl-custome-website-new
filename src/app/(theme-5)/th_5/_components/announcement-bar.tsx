import React from "react"
import Link from "next/link"

export default function AnnouncementBar() {
  return (
    <div
      className="w-full px-4 sm:px-8 py-2 flex items-center justify-between text-xs"
      style={{ backgroundColor: "#ece1d8" }}
    >
      <div className="hidden sm:flex items-center gap-4 text-black/70">
        <Link href="/shop" className="hover:text-black transition-colors">
          Track order
        </Link>
        <span className="text-black/30">|</span>
        <Link href="/shop" className="hover:text-black transition-colors">
          Complaint
        </Link>
      </div>

      <p className="text-center text-black/80 font-medium tracking-wide flex-1">
        LAST CHANCE TO SPOIL MOM &mdash;{" "}
        <Link
          href="/shop"
          className="font-bold underline underline-offset-2 hover:text-black"
        >
          UPTO 80% OFF...
        </Link>
      </p>

      <div className="sm:hidden" />
    </div>
  )
}
