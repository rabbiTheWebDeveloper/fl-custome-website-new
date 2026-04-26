import React from "react"
import { Truck, RefreshCw, TrendingUp, Star } from "lucide-react"

const FEATURES = [
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Fast Delivery",
    description: "Swift delivery to your doorstep",
  },
  {
    icon: <RefreshCw size={28} strokeWidth={1.5} />,
    title: "7 Days Return",
    description: "Hassle-free return policy",
  },
  {
    icon: <TrendingUp size={28} strokeWidth={1.5} />,
    title: "Emerging Trend",
    description: "Latest styles every week",
  },
  {
    icon: <Star size={28} strokeWidth={1.5} />,
    title: "Premium Quality",
    description: "Crafted with the finest materials",
  },
]

export default function FeaturesStrip() {
  return (
    <section className="py-5 sm:py-14 bg-white border-y border-gray-100">
      {/* Mobile: horizontal scroll chips */}
      <div
        className="sm:hidden flex gap-3 overflow-x-auto px-4 pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex-shrink-0 flex items-center gap-2.5 bg-gray-50 rounded-2xl px-4 py-3 min-w-[170px]"
          >
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#b8860b] shadow-sm shrink-0">
              {f.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wide text-gray-900">
                {f.title}
              </p>
              <p className="text-[9px] text-gray-500 leading-relaxed">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop: 4-column grid */}
      <div className="hidden sm:block max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="text-[#b8860b]">{f.icon}</div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-1">
                  {f.title}
                </p>
                <p className="text-[11px] text-gray-500">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
