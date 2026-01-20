const Testimonials = () => {
  return (
    <section className="py-20 px-4 md:px-12 max-w-[1400px] mx-auto">
      <div className="text-center mb-16">
        <h3 className="font-['Space_Grotesk'] text-[42px] font-semibold mb-4">
          Loved by{" "}
          <span className="italic font-normal bg-gradient-to-r from-[#ff4d8c] to-[#ff8f70] bg-clip-text text-transparent">
            Thousands
          </span>
        </h3>
        <p className="text-lg text-[#666]">Real results from real people</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Testimonial 1 */}
        <div className="group bg-white rounded-[24px] p-8 border border-[#eee] transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
          <div className="flex text-[#ffb800] text-lg mb-4">★★★★★</div>
          <p className="text-base leading-relaxed text-[#444] mb-6">
            My skin has never looked better! The Vit-C Booster completely
            transformed my morning routine. Glowing skin without any filters.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4d8c] to-[#ff8f70]" />
            <div>
              <h4 className="font-semibold text-sm">Sarah Chen</h4>
              <p className="text-xs text-[#888]">Verified Buyer</p>
            </div>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className="group bg-white rounded-[24px] p-8 border border-[#eee] transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
          <div className="flex text-[#ffb800] text-lg mb-4">★★★★★</div>
          <p className="text-base leading-relaxed text-[#444] mb-6">
            Finally found skincare that actually works for sensitive skin. The
            Barrier Repair is a game changer. Worth every penny!
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe]" />
            <div>
              <h4 className="font-semibold text-sm">Maya Rodriguez</h4>
              <p className="text-xs text-[#888]">Verified Buyer</p>
            </div>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className="group bg-white rounded-[24px] p-8 border border-[#eee] transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
          <div className="flex text-[#ffb800] text-lg mb-4">★★★★★</div>
          <p className="text-base leading-relaxed text-[#444] mb-6">
            Obsessed with the Glow Tonic! My pores are smaller and my skin
            texture is so smooth. This brand is the real deal.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffe4e6] to-[#fecdd3]" />
            <div>
              <h4 className="font-semibold text-sm">Zoe Williams</h4>
              <p className="text-xs text-[#888]">Verified Buyer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
