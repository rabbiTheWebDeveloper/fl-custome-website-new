"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import { Truck, RefreshCw, TrendingUp, Star } from "lucide-react"

/* ─── Features strip ─── */
const FEATURES = [
  {
    icon: <Truck size={30} strokeWidth={1.4} />,
    title: "FAST DELIVERY",
    desc: "Get your order within 7-10 days",
  },
  {
    icon: <RefreshCw size={30} strokeWidth={1.4} />,
    title: "7 DAYS RETURN",
    desc: "Money back guaranteed",
  },
  {
    icon: <TrendingUp size={30} strokeWidth={1.4} />,
    title: "EMERGING TREND",
    desc: "Stay on trend with us",
  },
  {
    icon: <Star size={30} strokeWidth={1.4} />,
    title: "PREMIUM QUALITY",
    desc: "Experience luxury with every purchase",
  },
]

const ABOUT_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Blogs", href: "/blog" },
  { label: "Exchange & Refund Policy", href: "/refund" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "FAQs", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
]

const CUSTOMER_SERVICE = [
  { label: "Track my Order", href: "/track" },
  { label: "I Have a Complaint", href: "/complaint" },
  { label: "Talk to the CFO", href: "/contact" },
]

const PAYMENT_METHODS = [
  { label: "COD", bg: "#f59e0b" },
  { label: "bKash", bg: "#e2136e" },
  { label: "Nagad", bg: "#f97316" },
  { label: "Rocket", bg: "#7c3aed" },
  { label: "AMEX", bg: "#2563eb" },
  { label: "Visa", bg: "#1d4ed8" },
  { label: "MC", bg: "#dc2626" },
]

const FLAGS = [
  { country: "Pakistan", emoji: "🇵🇰" },
  { country: "Bangladesh", emoji: "🇧🇩" },
  { country: "Sri Lanka", emoji: "🇱🇰" },
]

export default function Th5Footer({
  domainInfo,
}: {
  domainInfo: {
    shop_logo?: string | null
    name?: string | null
    shop_address?: string | null
    phone?: string | null
  } | null
}) {
  const [email, setEmail] = useState("")
  const shopName = domainInfo?.name || "Patchee"

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail("")
    alert("Thank you for subscribing!")
  }

  return (
    <footer>
      {/* ── Features strip ── */}
      <div className="border-t border-b border-gray-100 bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center gap-3"
            >
              <span className="text-[#c8922a]">{f.icon}</span>
              <p className="text-xs font-bold tracking-[0.12em] text-gray-900">
                {f.title}
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main dark footer ── */}
      <div className="bg-[#1f1f1f] text-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1 – Newsletter + Social */}
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#c8922a]">
                Join The {shopName} Movement
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sign up to our newsletter to receive exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full bg-transparent border border-gray-600 text-white text-xs px-3 py-2.5 outline-none focus:border-[#c8922a] transition-colors placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  className="w-full border border-white text-white text-xs font-bold tracking-[0.2em] uppercase py-2.5 hover:bg-white hover:text-black transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>

              {/* International */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-2">
                  {shopName} International
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {FLAGS.map((f) => (
                    <span
                      key={f.country}
                      className="text-xs text-gray-400 flex items-center gap-1"
                    >
                      <span>{f.emoji}</span> {f.country}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Col 2 – About Us */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-300">
                About Us
              </h3>
              <nav className="flex flex-col gap-2.5">
                {ABOUT_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-400 hover:text-white transition-colors leading-relaxed"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3 – Reach Us */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-300">
                Reach Us
              </h3>
              <div className="flex flex-col gap-3 text-xs text-gray-400">
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
                <p className="leading-relaxed">
                  Sales Queries WhatsApp:{" "}
                  <a
                    href="https://wa.me/8801627280875"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#c8922a] transition-colors"
                  >
                    +880 16 2728 0875
                  </a>
                </p>
                <p className="leading-relaxed">
                  Complaints Queries WhatsApp:{" "}
                  <a
                    href="https://wa.me/8801996195448"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#c8922a] transition-colors"
                  >
                    +880 19 9619 5448
                  </a>
                </p>
                <p className="leading-relaxed">
                  Complaints Email:{" "}
                  <a
                    href="mailto:complaints@thepatchee.com"
                    className="text-[#c8922a] hover:underline"
                  >
                    complaints@thepatchee.com
                  </a>
                </p>
              </div>
            </div>

            {/* Col 4 – Customer Service */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-300">
                Customer Service
              </h3>
              <nav className="flex flex-col gap-2.5">
                {CUSTOMER_SERVICE.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div className="border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-600 tracking-wide uppercase">
              © {new Date().getFullYear()} · {shopName.toUpperCase()} BANGLADESH
              · POWERED BY{" "}
              <Link
                href="https://funnelliner.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                FUNNEL LINER
              </Link>
            </p>

            {/* Payment badges */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {PAYMENT_METHODS.map((pm) => (
                <span
                  key={pm.label}
                  className="inline-flex items-center justify-center px-2 py-1 rounded text-[9px] font-bold text-white"
                  style={{ backgroundColor: pm.bg, minWidth: "34px" }}
                >
                  {pm.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
