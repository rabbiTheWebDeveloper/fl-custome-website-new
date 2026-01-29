import { cn } from "@/lib/utils"
import React from "react"
import { ProductImageCarousel } from "../../_components/product/product-image-carousel"
import { PromoBanner } from "../../_components/promo-banner/promo-banner"
import { ProductsCarousel } from "../../_components/products/products-carousel"
import { api } from "@/lib/api-client"
import { IProduct } from "../../types/product"
import { getDomainHeaders } from "@/lib/domain"
import { CustomStoreExample } from "@/lib/cart/example"
import { ProductCartControls } from "../../_components/product/product-cart-controls"

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

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ query: string }>
}) {
  // const productId = params.slug
  const { id } = await params
  const { query } = await searchParams
  console.log("Product ID:", id, "Query:", query)
  const headers = await getDomainHeaders()

  const response = await api.get(`/customer/products/${id}`, {
    headers,
  })
  const product: IProduct = (response.data as { data: IProduct }).data
  console.log("Product Details: ", product)

  return (
    <main>
      <div className="py-10 container">
        <div className="grid md:grid-cols-7 gap-24">
          <div className="col-span-3">
            <ProductImageCarousel
              images={[product.main_image ?? "", ...product.other_images]}
            />
          </div>
          <div className="max-md:overflow-hidden col-span-4">
            <div>
              <h1 className="text-2xl md:text-[44px] font-semibold mt-3">
                {product.product_name}
              </h1>
              {/* <h2 className="mt-3 text-xl md:text-3xl font-semibold text-primary">
                {product.price} */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-500 line-through">
                    ৳{product.price}
                  </span>
                  <span className="mt-3 text-xl md:text-3xl font-semibold text-primary">
                    ৳{product.discounted_price}
                  </span>
                </div>
              </div>
              {/* </h2> */}
            </div>
            <ProductCartControls product={product} swatches={swatches} />

            <div
              className="mt-8 space-y-8 w-3xl wrap-break-word"
              dangerouslySetInnerHTML={{
                __html: product.short_description || "",
              }}
            />
            <div
              className="mt-8 space-y-8 w-3xl wrap-break-word"
              dangerouslySetInnerHTML={{
                __html: product.long_description || "",
              }}
            />
            {/* {productDetails.map((detail) => (
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
              ))} */}
            {/* {product.short_description && (
                <div>
                  <h3 className="uppercase font-bold">Description</h3>
                  <p className="mt-3 text-[#595959]">
                    {product.short_description}
                  </p>
                </div>
              )} */}
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* You may also like */}
      <ProductsCarousel title="You may also like" product={product} />

      {/* CTA */}
      <PromoBanner />
      <CustomStoreExample />
    </main>
  )
}
