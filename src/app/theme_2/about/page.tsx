import Link from "next/link"
import { Button } from "../_components/ui/button"
import { PromoBanner } from "../_components/promo-banner/promo-banner"

export default function AboutPage() {
  return (
    <main>
      {/* Banner */}
      <div className="relative min-w-0 flex-[0_0_100%] h-[600px] md:h-[800px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/temp/temp-slider-1.png)`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl mx-auto leading-[150%]">
              Wear Your Confidence
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Fresh fits made for real life. Style that keeps you looking sharp
              without trying too hard.
            </p>
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-md">
              <Link href="#">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container px-4 py-16 md:pt-24 md:pb-10">
        {/* About Us Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            About Us - FunnelLiner
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            At FunnelLiner, we&apos;re all about leveling up your wardrobe
            without making it complicated. We started with one simple idea:
            fashion should be fresh, comfortable, and actually affordable. No
            gatekeeping, no boring basics — just good vibes and great fits.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h3>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            At FunnelLiner, we&apos;re all about leveling up your wardrobe
            without making it complicated. We started with one simple idea:
            fashion should be fresh, comfortable, and actually affordable. No
            gatekeeping, no boring basics — just good vibes and great fits.
          </p>
        </div>

        {/* What We Stand For Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            What We Stand For
          </h3>
          <ul className="space-y-3">
            <li className="text-muted-foreground text-base md:text-lg leading-relaxed flex items-start">
              <span className="text-orange-500 mr-3 mt-1">✨</span>
              <span>
                <strong>Quality First -</strong> If it&apos;s not soft, comfy,
                and durable, it doesn&apos;t make the cut.
              </span>
            </li>
            <li className="text-muted-foreground text-base md:text-lg leading-relaxed flex items-start">
              <span className="text-orange-500 mr-3 mt-1">✨</span>
              <span>
                <strong>Style That Speaks -</strong> Trendy drops, bold fits,
                and timeless essentials — all curated for your vibe.
              </span>
            </li>
            <li className="text-muted-foreground text-base md:text-lg leading-relaxed flex items-start">
              <span className="text-orange-500 mr-3 mt-1">✨</span>
              <span>
                <strong>Fair Prices -</strong> Premium doesn&apos;t have to mean
                pricey. We keep everything real, accessible, and worth it.
              </span>
            </li>
            <li className="text-muted-foreground text-base md:text-lg leading-relaxed flex items-start">
              <span className="text-orange-500 mr-3 mt-1">✨</span>
              <span>
                <strong>Customer Obsessed -</strong> You&apos;re the whole
                reason we exist. Our mission? Make unboxing — smooth and
                satisfying.
              </span>
            </li>
          </ul>
        </div>

        {/* Mission and Vision Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Our Mission */}
          <div className="bg-[#F9F9F9] p-8 rounded-lg">
            <h3 className="text-2xl md:text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              To inspire confidence through clothing that feels good, looks
              good, and helps you show up as your best self every single day.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-[#F9F9F9] p-8 rounded-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              A world where everyone can express themselves through fashion
              without limits — no matter their size, budget, or style.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <PromoBanner />
    </main>
  )
}
