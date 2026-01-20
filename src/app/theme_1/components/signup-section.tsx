import { ArrowRight } from "lucide-react"
const SignupSection = () => {
  return (
    <section className="relative py-32 px-4 md:px-12 max-w-[1400px] mx-auto">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-40 blur-[100px] bg-[radial-gradient(circle,rgb(255,200,220)_0%,rgba(255,255,255,0)_70%)]" />

      <div className="relative bg-gradient-to-br from-white to-[#fef9fb] rounded-[40px] p-16 border border-[rgba(255,77,140,0.1)] shadow-[0_40px_80px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20 blur-[60px] bg-[radial-gradient(circle,rgb(255,143,112)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full opacity-20 blur-[60px] bg-[radial-gradient(circle,rgb(224,231,255)_0%,rgba(255,255,255,0)_70%)]" />

        <div className="relative max-w-[700px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white border border-[#ffe0eb] rounded-full text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_4px_12px_rgba(255,77,140,0.08)]">
            <span className="w-2 h-2 bg-[#ff4d8c] rounded-full mr-2 animate-pulse" />
            Coming Soon
          </div>

          <h2 className="font-['Space_Grotesk'] text-[56px] leading-[1.1] font-semibold tracking-[-0.03em] mb-6 text-black">
            Be First to Try Our
            <br />
            <span className="italic font-normal bg-gradient-to-r from-[#ff4d8c] to-[#ff8f70] bg-clip-text text-transparent">
              Next Big Thing
            </span>
          </h2>

          <p className="text-lg leading-relaxed text-[#555] mb-10 max-w-[540px] mx-auto">
            Get exclusive early access to our revolutionary new formula. Sign up
            now and be the first to experience next-level skincare innovation.
          </p>

          {/* Email Form */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-[520px] mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border border-[#e5e5e5] bg-white text-base focus:outline-none focus:border-[#ff4d8c] focus:ring-2 focus:ring-[rgba(255,77,140,0.1)] transition-all"
              required
            />
            <button
              type="submit"
              className="bg-[#111] text-white px-9 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-[#222] inline-flex items-center justify-center gap-2.5 whitespace-nowrap"
            >
              Join Waitlist
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-xs text-[#888]">
            Join 12,000+ skincare lovers on the waitlist. No spam, just glow.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SignupSection
