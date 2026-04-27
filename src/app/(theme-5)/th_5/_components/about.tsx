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
  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-12">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <span className="text-black">{pageheader || "About Us"}</span>
        </nav>

        {/* ══ Hero Section ══ */}
        <div className="mb-20 lg:mb-28 text-center sm:text-left">
          <div className="max-w-4xl">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-5">
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-widest uppercase text-black leading-tight mb-8">
              {pageheader?.replace(/_/g, " ") || "About Us"}
            </h1>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="hidden sm:block w-12 h-[1px] bg-black mt-2.5" />
              <p className="text-sm font-medium text-gray-500 max-w-lg leading-relaxed">
                We are dedicated to delivering exceptional products and an
                experience that keeps you coming back.
              </p>
            </div>
          </div>
        </div>

        {/* ══ Main Content Card ══ */}
        <div className="mb-20 lg:mb-28">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
            {/* Left sticky label */}
            <div className="lg:sticky lg:top-32">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">
                Who We Are
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-widest uppercase text-black leading-tight">
                Crafted with purpose, delivered with care.
              </h2>
              <div className="w-16 h-[1px] bg-black mt-8" />
            </div>

            {/* Right content */}
            <div className="bg-white border border-gray-200 p-8 sm:p-12">
              <div
                className="prose prose-sm sm:prose-base max-w-none prose-p:leading-relaxed prose-p:text-gray-600 prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-black prose-a:text-black prose-a:font-bold prose-a:underline"
                dangerouslySetInnerHTML={{
                  __html:
                    domainInfo ||
                    "<p>We are committed to bringing you the best products at the best prices. Our team works tirelessly to curate a premium selection that meets your needs and exceeds your expectations every time.</p>",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
