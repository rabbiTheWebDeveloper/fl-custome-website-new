import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"

export const PromoBanner = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative py-16 rounded-3xl overflow-hidden">
          {/* Background Image */}
          <Image
            src="/product-placeholder.png"
            alt="Promotional banner"
            fill
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-xl leading-[150%]">
              Fit that the speaks before you do.
            </h2>
            <p className="text-base md:text-lg mb-6 max-w-2xl opacity-95">
              Unlock fresh drops, premium fabrics, and everyday fits that never
              miss. Dress bold, feel iconic.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base rounded-xl"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
