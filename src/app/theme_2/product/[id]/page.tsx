import { cn } from "@/lib/utils"
import { CartInput } from "../../_components/carts/cart-input"
import { Button } from "../../_components/ui/button"
import React from "react"
import { VariantSelector } from "../../_components/product/variant-selector"
import { ProductImageCarousel } from "../../_components/product/product-image-carousel"
import { PromoBanner } from "../../_components/promo-banner/promo-banner"
import { ProductsCarousel } from "../../_components/products/products-carousel"

// Fake data - Replace in prod
const breadcrumbs = [
  { label: "Shop", href: "#" },
  { label: "Men", href: "#" },
  { label: "Hoodie", href: "#" },
  { label: "Essential Hoodie ", href: "#", current: true },
]

const productImages = [
  {
    id: "1",
    src: "/temp/slider-1.png",
    alt: "Essential Hoodie - Main View",
  },
  {
    id: "2",
    src: "/temp/slider-2.png",
    alt: "Essential Hoodie - Side View",
  },
  {
    id: "3",
    src: "/temp/slider-3.png",
    alt: "Essential Hoodie - Back View",
  },
  {
    id: "4",
    src: "/temp/slider-4.png",
    alt: "Essential Hoodie - Detail View",
  },
  {
    id: "5",
    src: "/temp/temp-slider-1.png",
    alt: "Essential Hoodie - Lifestyle",
  },
]

const swatches = [
  {
    type: "color" as const,
    key: "colors",
    label: "Colors",
    options: [
      { label: "Black", color: "#000000", selected: true },
      { label: "Blue", color: "#ADD8E6" },
      { label: "Green", color: "#90EE90" },
      { label: "Pink", color: "#FFB6C1" },
      { label: "Yellow", color: "#FFFFE0" },
    ],
  },
  {
    type: "size" as const,
    key: "sizes",
    label: "Size",
    options: [
      { label: "XS", selected: true },
      { label: "S" },
      { label: "M" },
      { label: "L" },
      { label: "XL" },
    ],
  },
]
const productDetails = [
  {
    id: 1,
    title: "Description",
    type: "paragraph" as const,
    content:
      "Soft, airy, and built for all-day chill. This oversized tee gives you that effortless street vibe without trying too hard. Perfect for daily wear, layering, or straight-up lounging.",
  },
  {
    id: 2,
    title: "Size & Fit",
    type: "list" as const,
    items: [
      "For woman, take your usual size if you want a relaxed fit or a size down if you want a closer fit.",
      "For man, take your usual size if you want a true to size fit or take a size up if you want a more relaxed fit.",
      "Our studio model is 5'9'' / 178 cm and wears a size S.",
      "Our campaign model is 5'8\" 1m73 and wears a size S.",
    ],
  },
  {
    id: 3,
    title: "Shipping",
    type: "list" as const,
    items: [
      "During Adidas collaborations the shipping is at customer's charge.",
      "Ships within 4-6 business days from the order date.",
      "Worldwide shipping: Duties & taxes included.",
    ],
  },
  {
    id: 4,
    title: "Returns",
    type: "list" as const,
    items: [
      "All Adidas items are final sales. Please refer to the size chart before placing your order.",
      "Refunds available within 14 days of delivery.",
      "Exchanges available for U.S. customers.",
    ],
  },
]

export default function ProductPage() {
  return (
    <main>
      <div className="py-10 container">
        <div className="grid md:grid-cols-2 gap-15">
          <div>
            <ProductImageCarousel images={productImages} />
          </div>
          <div className="max-md:overflow-hidden">
            <ul className="flex items-center gap-3">
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <li className="min-w-0 overflow-hidden flex">
                    <a
                      className={cn(
                        "font-medium transition-colors hover:text-foreground truncate min-w-0",
                        !breadcrumb.current && "text-[#595959]"
                      )}
                      href={breadcrumb.href}
                    >
                      {breadcrumb.label}
                    </a>
                  </li>
                  {index + 1 !== breadcrumbs.length && <li>/</li>}
                </React.Fragment>
              ))}
            </ul>
            <div>
              <h1 className="text-2xl md:text-[44px] font-semibold mt-3">
                Essential Hoodie{" "}
              </h1>
              <h2 className="mt-3 text-xl md:text-3xl font-semibold text-primary">
                Tk 38,200
              </h2>
            </div>
            <div className="mt-8">
              <VariantSelector swatches={swatches} />
            </div>
            <div className="mt-8">
              <div className="flex items-center gap-5 flex-wrap">
                <div className=" flex-1 min-w-0">
                  <CartInput />
                </div>
                <Button
                  size="lg"
                  className="h-13 rounded-xl text-base font-medium md:flex-1 min-w-0"
                >
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  className="h-13 rounded-xl text-base font-medium bg-black md:flex-1 min-w-0 max-md:w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              {productDetails.map((detail) => (
                <div key={detail.id}>
                  <h3 className="uppercase font-bold">{detail.title}</h3>
                  {detail.type === "paragraph" ? (
                    <p className="mt-3 text-[#595959]">{detail.content}</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 mt-3 text-[#595959]">
                      {detail.items.map((item, index) => (
                        <li className="marker:indent-2" key={index}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <ProductsCarousel title="You may also like" />

      {/* CTA */}
      <PromoBanner />
    </main>
  )
}
