import Link from "next/link"
import Image from "next/image"

interface Banner {
  id?: number | string
  image: string
  title?: string
  description?: string
  link?: string
}

export default function LuxeLeatherBanner({ banners }: { banners: Banner[] }) {
  const mainBanner = banners?.[0]

  return (
    <section className="relative w-full bg-black overflow-hidden py-14 sm:py-20">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1a1a,_#000000)] opacity-90" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Text */}
        <div className="text-white z-10">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-3 font-semibold">
            {mainBanner?.title || "Exclusively Yours"}
          </p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal leading-none">
            Luxe
            <br />
            <span className="italic">Leather</span>
            <br />
            <span className="font-bold">Bags</span>
          </h2>
          <Link
            href={
              mainBanner?.link && mainBanner.link !== "#"
                ? mainBanner.link
                : "/shop"
            }
            className="mt-8 inline-block border border-white/60 text-white/90 px-8 py-3 text-xs font-bold tracking-widest uppercase hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>

        {/* Right decorative elements - Staggered Collage */}
        <div className="hidden sm:flex relative z-10 items-center gap-3 lg:gap-4">
          {banners && banners.length > 0 ? (
            banners.slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className={`relative rounded-sm overflow-hidden shadow-2xl ${
                  idx === 0
                    ? "w-[150px] h-[230px] lg:w-[200px] lg:h-[300px]"
                    : idx === 1
                      ? "w-[130px] h-[200px] lg:w-[170px] lg:h-[250px] mt-16"
                      : "w-[110px] h-[170px] lg:w-[150px] lg:h-[220px] -mt-16"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title || `Luxe Leather ${idx + 1}`}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 1024px) 200px, 300px"
                />
              </div>
            ))
          ) : (
            <div className="text-white/5 text-[120px] lg:text-[160px] font-black leading-none select-none">
              LB
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
