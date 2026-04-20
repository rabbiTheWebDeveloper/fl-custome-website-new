import Link from "next/link"
import {
  ChevronRight,
  Heart,
  Award,
  Users,
  Package,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react"

interface AboutUsProps {
  domainInfo: string
  pageheader?: string
}

const AboutUs: React.FC<AboutUsProps> = ({ domainInfo, pageheader }) => {
  const stats = [
    { icon: Package, value: "1,000+", label: "Products" },
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Award, value: "5 ★", label: "Top Rated" },
    { icon: Heart, value: "100%", label: "Satisfaction" },
  ]

  const values = [
    {
      icon: ShieldCheck,
      title: "Trusted Quality",
      desc: "Every product is carefully vetted to meet our high standards before it reaches you.",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      desc: "Swift delivery with real-time tracking so your order arrives when you need it.",
    },
    {
      icon: Globe,
      title: "Built for Everyone",
      desc: "From everyday essentials to premium finds — our range covers every lifestyle.",
    },
    {
      icon: Heart,
      title: "Customer First",
      desc: "Your satisfaction is our north star. Hassle-free returns, always.",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] text-gray-400 dark:text-zinc-600 uppercase mb-12">
          <Link
            href="/"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={10} />
          <span className="text-gray-700 dark:text-zinc-300">
            {pageheader || "About Us"}
          </span>
        </nav>

        {/* ══ Hero Section ══ */}
        <div className="mb-20 lg:mb-28">
          <div className="max-w-4xl">
            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-gray-400 dark:text-zinc-600 mb-5">
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.95] mb-8">
              {pageheader?.replace(/_/g, " ") || "About Us"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-black dark:bg-white rounded-full" />
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 max-w-lg leading-relaxed">
                We are dedicated to delivering exceptional products and an
                experience that keeps you coming back.
              </p>
            </div>
          </div>
        </div>

        {/* ══ Stats Row ══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-20 lg:mb-28">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="group flex flex-col items-center text-center p-6 sm:p-8 bg-gray-50 dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={18} className="text-white dark:text-black" />
              </div>
              <p className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 mt-2">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ══ Main Content Card ══ */}
        <div className="mb-20 lg:mb-28">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
            {/* Left sticky label */}
            <div className="lg:sticky lg:top-32">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-600 mb-3">
                Who We Are
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight">
                Crafted with purpose, delivered with care.
              </h2>
              <div className="w-8 h-1 bg-black dark:bg-white rounded-full mt-6" />
            </div>

            {/* Right content */}
            <div className="bg-gray-50 dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900 p-8 sm:p-10 lg:p-12">
              <div
                className="prose prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-zinc-300 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-black dark:prose-a:text-white prose-a:font-semibold prose-img:rounded-3xl prose-img:shadow-xl"
                dangerouslySetInnerHTML={{
                  __html:
                    domainInfo ||
                    "<p>We are committed to bringing you the best products at the best prices. Our team works tirelessly to curate a premium selection that meets your needs and exceeds your expectations every time.</p>",
                }}
              />
            </div>
          </div>
        </div>

        {/* ══ Values Grid ══ */}
        <div className="mb-20 lg:mb-28">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-900" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-600 mb-1">
                What Drives Us
              </p>
              <h2 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                Our Core Values
              </h2>
            </div>
            <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-900" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-5 p-6 sm:p-7 bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-md transition-all group"
              >
                <div className="flex-shrink-0 w-11 h-11 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:border-black dark:group-hover:border-white transition-all">
                  <Icon
                    size={18}
                    className="text-gray-700 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-black transition-colors"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ CTA Banner ══ */}
        <div className="relative bg-gray-950 dark:bg-zinc-100 rounded-[2.5rem] overflow-hidden p-10 sm:p-14 lg:p-16 text-center">
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-52 h-52 bg-white/5 dark:bg-black/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white/5 dark:bg-black/10 rounded-full pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-zinc-600 mb-4">
              Ready to explore?
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white dark:text-black leading-tight mb-6">
              Discover our full collection
            </h2>
            <p className="text-sm text-gray-400 dark:text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
              Thousands of premium products, curated just for you. Free delivery
              on selected orders.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-transform shadow-2xl"
            >
              Shop Now
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
