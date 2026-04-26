import React from "react"
import Link from "next/link"

export default function PrimeDrop() {
  return (
    <section className="relative w-full min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] bg-black overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Dark background with text overlay — matches Patchee's "THE PRIME DROP" banner */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      {/* Decorative elements */}
      <div className="absolute inset-0 flex items-center px-8 sm:px-16 lg:px-24">
        <div className="text-white max-w-lg">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/60 mb-3">
            Patchee Top Picks
          </p>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal leading-none mb-6">
            The Prime
            <br />
            <span className="font-bold">Drop</span>
          </h2>
          <p className="text-white/70 text-sm mb-8 tracking-wide">
            Upto <span className="text-white font-bold text-2xl">50%</span> off
            on exclusive prime selections
          </p>
          <Link
            href="/shop"
            className="inline-block border border-white text-white px-10 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Percentage badge */}
      <div className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center text-white">
        <span className="text-[80px] sm:text-[120px] font-black leading-none text-white/10 select-none">
          50%
        </span>
        <span className="text-white/60 text-xs tracking-widest uppercase -mt-4">
          Off
        </span>
      </div>
    </section>
  )
}
