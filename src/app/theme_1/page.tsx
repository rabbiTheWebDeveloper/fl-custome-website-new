"use client"

import { ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"
import Header from "@/app/theme_1/components/header"
import MainHero from "@/app/theme_1/components/main-hero"
import MarkTicker from "@/app/theme_1/components/mark-ticker"
import FeatureProducts from "@/app/theme_1/components/feature-product"
import SignupSection from "@/app/theme_1/components/signup-section"
import Testimonials from "@/app/theme_1/components/testimonials"
import Footer from "@/app/theme_1/components/footer"
import { useTranslations } from "next-intl"

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const t = useTranslations("HomePage")
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-[#111] overflow-x-hidden">
      {/* Ambient Background Blobs */}
      <div className="blob blob-1 fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-60 blur-[80px] -z-10 bg-[radial-gradient(circle,rgb(224,231,255)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="blob blob-2 fixed bottom-0 right-[-10%] w-[600px] h-[600px] rounded-full opacity-60 blur-[80px] -z-10 bg-[radial-gradient(circle,rgb(255,228,230)_0%,rgba(255,255,255,0)_70%)]" />
      {/* Header */}
      <Header />
      {/* Main Hero */}
      <MainHero />
      {/* Marquee Ticker */}
      <MarkTicker />
      {/* Featured Products Strip */}
      <FeatureProducts />
      <h1>{t("title")}</h1>
      {/* New Product Launch Signup Section */}
      <SignupSection />
      {/* Testimonials Section */}
      <Testimonials />
      {/* Footer */}
      <Footer />

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[999] w-12 h-12 rounded-full bg-white/80 backdrop-blur-xl border border-[rgba(0,0,0,0.06)] shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] active:scale-95 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-[#ff4d8c]" />
      </button>
    </div>
  )
}
