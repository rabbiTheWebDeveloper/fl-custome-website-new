import Link from "next/link"
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react"

export default function FooterUI({
  domainInfo,
}: {
  domainInfo: Record<string, unknown> | null
}) {
  const shopName = domainInfo?.name || "Premium."
  console.log(domainInfo, "shopName")
  const isLongName = shopName.length > 15
  const displayShopName = isLongName
    ? shopName.substring(0, 13) + "."
    : shopName

  return (
    <footer className="relative bg-zinc-950 text-white pt-20 pb-0 rounded-t-[2.5rem] overflow-hidden">
      {/* Top ambient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {/* Ambient glow */}
      <div className="absolute -top-[600px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-white/3 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        {/* Top Brand + Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-12 pb-16 border-b border-zinc-900">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <span className="text-2xl font-black tracking-tighter text-white">
                {shopName}
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mb-8">
              Premium quality products carefully curated for the discerning
              customer. Shop with confidence.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Twitter, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-600 mb-5">
              Shop
            </h4>
            <nav className="flex flex-col gap-3.5">
              {[
                { label: "All Products", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5 group w-max"
                >
                  {label}
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-600 mb-5">
              Legal
            </h4>
            <nav className="flex flex-col gap-3.5">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5 group w-max"
                >
                  {label}
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-600 mb-5">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4 text-zinc-400">
              {domainInfo?.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="shrink-0 text-zinc-600 mt-0.5" />
                  <span className="text-sm leading-relaxed">
                    {domainInfo.address}
                  </span>
                </div>
              )}
              {domainInfo?.phone && (
                <a
                  href={`tel:${domainInfo.phone}`}
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <Phone size={15} className="shrink-0 text-zinc-600" />
                  <span className="text-sm">{domainInfo.phone}</span>
                </a>
              )}
              {domainInfo?.email && (
                <a
                  href={`mailto:${domainInfo.email}`}
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <Mail size={15} className="shrink-0 text-zinc-600" />
                  <span className="text-sm">{domainInfo.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mega Typography Display */}
        <div className="py-6 flex items-center justify-center overflow-hidden select-none pointer-events-none">
          <h1
            className="font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 whitespace-nowrap"
            style={{
              fontSize: "clamp(48px, 16vw, 220px)",
              letterSpacing: "-0.04em",
            }}
          >
            {displayShopName}
          </h1>
        </div>

        {/* Bottom Strip */}
        <div className="py-6 border-t border-zinc-900/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-700 font-medium">
          <p>
            &copy; {new Date().getFullYear()} {shopName}. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <Link
              href="https://funnelliner.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Funnel Liner
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
