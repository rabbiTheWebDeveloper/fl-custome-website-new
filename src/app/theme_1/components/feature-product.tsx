const FeatureProducts = () => {
  return (
    <section className="py-20 px-4 md:px-12 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end mb-10">
        <h3 className="font-['Space_Grotesk'] text-[32px]">Trending Now</h3>
        <a href="#" className="underline font-medium">
          See All Products
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Product 1 */}
        <div className="group bg-white rounded-[20px] p-6 transition-all duration-300 cursor-pointer border border-transparent hover:translate-y-[-10px] hover:border-[#eee] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <div className="w-full h-60 rounded-xl overflow-hidden mb-5 bg-[#f5f5f5]">
            <img
              src="/minimalist-rose-pink-toner-bottle-on-white-backgro.jpg"
              alt="Toner"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-base block mb-1">
                Glow Tonic
              </span>
              <span className="text-xs text-[#888]">Exfoliator</span>
            </div>
            <span className="font-['Space_Grotesk'] font-bold">$24</span>
          </div>
        </div>

        {/* Product 2 */}
        <div className="group bg-white rounded-[20px] p-6 transition-all duration-300 cursor-pointer border border-transparent hover:translate-y-[-10px] hover:border-[#eee] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <div className="w-full h-60 rounded-xl overflow-hidden mb-5 bg-[#f5f5f5]">
            <img
              src="/vitamin-c-serum-collection-glossier-style-flatlay-.jpg"
              alt="Serum"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-base block mb-1">
                Vit-C Booster
              </span>
              <span className="text-xs text-[#888]">Brightening</span>
            </div>
            <span className="font-['Space_Grotesk'] font-bold">$42</span>
          </div>
        </div>

        {/* Product 3 */}
        <div className="group bg-white rounded-[20px] p-6 transition-all duration-300 cursor-pointer border border-transparent hover:translate-y-[-10px] hover:border-[#eee] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <div className="w-full h-60 rounded-xl overflow-hidden mb-5 bg-[#f5f5f5]">
            <img
              src="/luxurious-cream-moisturizer-jar-minimal-clean-beau.jpg"
              alt="Moisturizer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-base block mb-1">
                Barrier Repair
              </span>
              <span className="text-xs text-[#888]">Moisturizer</span>
            </div>
            <span className="font-['Space_Grotesk'] font-bold">$38</span>
          </div>
        </div>

        {/* Product 4 */}
        <div className="group bg-white rounded-[20px] p-6 transition-all duration-300 cursor-pointer border border-transparent hover:translate-y-[-10px] hover:border-[#eee] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
          <div className="w-full h-60 rounded-xl overflow-hidden mb-5 bg-[#f5f5f5]">
            <img
              src="/modern-sunscreen-tube-spf-50-clean-minimal-skincar.jpg"
              alt="Sunscreen"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-base block mb-1">
                Invisible Shield
              </span>
              <span className="text-xs text-[#888]">SPF 50</span>
            </div>
            <span className="font-['Space_Grotesk'] font-bold">$30</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureProducts
