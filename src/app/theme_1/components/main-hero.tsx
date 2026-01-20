import { ArrowRight } from "lucide-react"
function MainHero() {
  return (
    <main className="relative max-w-[1400px] w-full mx-auto min-h-screen pt-36 pb-16 px-4 md:px-12 grid md:grid-cols-2 items-center gap-16">
      <div className="z-[2]">
        <div className="inline-flex items-center px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <span className="w-2 h-2 bg-[#10b981] rounded-full mr-2" />
          New Drop V.2.0
        </div>

        <h1 className="font-['Space_Grotesk'] text-[76px] leading-[0.95] font-semibold tracking-[-0.03em] mb-6 text-black">
          Skincare for the <br />
          <span className="italic font-normal bg-gradient-to-r from-[#ff4d8c] to-[#ff8f70] bg-clip-text text-transparent">
            Main Character.
          </span>
        </h1>

        <p className="text-lg leading-relaxed text-[#555] max-w-[460px] mb-10">
          High-performance botanical formulas designed for your skin barrier.
          100% Vegan, Cruelty-free, and radically transparent. Get the glow
          without the filter.
        </p>

        <div className="flex gap-4 items-center">
          <a
            href="#"
            className="bg-[#111] text-white px-9 py-[18px] rounded-full font-semibold text-base transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-[#222] inline-flex items-center gap-2.5"
          >
            Shop The Edit
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="px-9 py-[18px] rounded-full font-semibold text-base bg-[rgba(255,255,255,0.5)] border border-[#e5e5e5] transition-all hover:bg-white hover:border-black"
          >
            View Lookbook
          </a>
        </div>
      </div>

      <div className="relative h-[700px] w-full">
        <div className="group w-full h-full rounded-[40px] overflow-hidden relative -rotate-2 transition-transform duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:rotate-0">
          <img
            src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80"
            alt="Model with glowing skin"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gen Z Sticker Element */}
          <div className="absolute top-5 left-5 z-[4] w-[100px] h-[100px] flex items-center justify-center bg-[#dbff00] rounded-full text-black font-extrabold font-['Space_Grotesk'] text-center rotate-[15deg] shadow-[0_10px_20px_rgba(0,0,0,0.1)] text-sm leading-tight">
            BEST
            <br />
            SELLER
          </div>
        </div>

        {/* Floating Glassmorphism Product Card 1 */}
        <div className="floating-card absolute bottom-[60px] left-[-40px] bg-[rgba(255,255,255,0.7)] backdrop-blur-2xl p-4 rounded-[20px] border border-[rgba(255,255,255,0.6)] shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex items-center gap-3 z-[3] animate-[float_6s_ease-in-out_infinite]">
          <img
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
            alt="Serum"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold mb-0.5">Dewy Drops</h4>
            <p className="text-xs text-[#666]">Hydrating Serum</p>
            <div className="flex text-[#ffb800] text-xs mt-0.5">★★★★★</div>
          </div>
        </div>

        {/* Floating Glassmorphism Product Card 2 */}
        <div className="floating-card absolute top-20 right-[-20px] bg-[rgba(255,255,255,0.7)] backdrop-blur-2xl p-4 rounded-[20px] border border-[rgba(255,255,255,0.6)] shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex items-center gap-3 z-[3] animate-[float_6s_ease-in-out_1.5s_infinite]">
          <img
            src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
            alt="Cream"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold mb-0.5">Cloud Cream</h4>
            <p className="text-xs text-[#666]">Night Recovery</p>
            <div className="flex text-[#ffb800] text-xs mt-0.5">★★★★☆</div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MainHero
