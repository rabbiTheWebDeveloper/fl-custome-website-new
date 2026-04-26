"use client"
import React from "react"

const TICKER_TEXT =
  "GET 10% OFF ON ALL CREDIT/DEBIT CARDS  ·  FREE SHIPPING ON ORDERS ABOVE ৳2000  ·  EASY 7-DAY RETURNS  ·  NEW ARRIVALS EVERY WEEK  ·  "

export default function MarqueeTicker() {
  return (
    <div className="w-full bg-white border-y border-gray-100 py-2.5 overflow-hidden">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {/* Duplicate for seamless loop */}
        {[0, 1].map((i) => (
          <span
            key={i}
            className="text-xs font-medium tracking-[0.15em] uppercase text-gray-800 pr-0"
            aria-hidden={i === 1}
          >
            {TICKER_TEXT.repeat(3)}
          </span>
        ))}
      </div>
    </div>
  )
}
