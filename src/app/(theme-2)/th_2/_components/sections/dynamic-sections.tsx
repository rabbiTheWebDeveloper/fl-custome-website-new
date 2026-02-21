"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useSections } from "../../store/sections"
import { ISectionItem, ISectionProduct } from "../../types/sections"
import Image from "next/image"
import { CountdownTimer } from "../ui/countdown-timer"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { toast } from "sonner"

interface SectionProductCardProps {
  product: ISectionProduct
}

const SectionProductCard = ({ product }: SectionProductCardProps) => {
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")
  const router = useRouter()
  const { addItem, getItemByProduct } = useCart()

  const discountedPrice = product.discounted_price ?? product.price
  const originalPrice = product.price
  const discountLabel = product.flat_discount_percent ?? product.discount ?? 0
  const hasDiscount =
    typeof discountLabel === "string"
      ? discountLabel !== "0%" && discountLabel !== "0"
      : Number(discountLabel) > 0
  const isStockOut = product.product_qty <= 0
  const image = product.main_image || product.wp_product_image_url

  // Check current quantity in cart
  const cartItem = getItemByProduct(product.id)
  const currentQuantity = cartItem?.quantity ?? 0

  const isAtMax =
    product.product_qty === 0 ||
    (product.product_qty ? currentQuantity >= product.product_qty : false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (product.product_qty === 0) {
      toast.error(tToast("outOfStock"))
      return
    }

    if (product.product_qty && currentQuantity >= product.product_qty) {
      toast.warning(tToast("maxQuantityReached"))
      return
    }

    try {
      await addItem({
        productId: product.id,
        name: product.product_name,
        price: product.price,
        discountedPrice: product.discounted_price,
        quantity: 1,
        metadata: {
          image: product.main_image,
          sku: product.product_code,
          ulid: product.ulid,
          maxQuantity: product.product_qty,
        },
        mergeIfExists: true,
        maxQuantity: product.product_qty,
      })
      toast.success(tToast("addedToCart"))
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast.error(tToast("addToCartError"))
    }
  }

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => router.push(`/product/${product.slug}?id=${product.ulid}`)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-3 bg-gray-100">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-5 left-3 z-10">
            <span className="bg-[#FFA01C] text-black text-sm font-semibold px-3 py-2 rounded-lg">
              {discountLabel} OFF
            </span>
          </div>
        )}

        {/* Stock Out Badge */}
        {isStockOut && (
          <div className="absolute top-5 right-3 z-10">
            <span className="bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-lg">
              STOCK OUT
            </span>
          </div>
        )}

        {/* Product Image */}
        {image && (
          <Image
            src={image}
            alt={product.product_name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="size-full inset-0 absolute bg-linear-to-b from-transparent via-transparent to-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

        {/* Add to Cart Button - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className="w-full bg-white text-black hover:bg-gray-100 rounded-xl py-6 md:text-base"
            onClick={handleAddToCart}
            disabled={isAtMax}
          >
            {isAtMax ? "Stock Out" : t("addToCart")}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900">
          {product.product_name}
        </h3>
        <div className="flex items-center gap-2">
          {originalPrice > discountedPrice ? (
            <>
              <span className="text-sm text-gray-500 line-through">
                ৳{originalPrice}
              </span>
              <span className="text-lg font-semibold text-primary">
                ৳{discountedPrice}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-primary">
              ৳{originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const DESCRIPTION_WORD_LIMIT = 10

const SectionDescription = ({ description }: { description: string }) => {
  const words = description.split(/\s+/)
  const isTruncated = words.length > DESCRIPTION_WORD_LIMIT
  const truncated = isTruncated
    ? words.slice(0, DESCRIPTION_WORD_LIMIT).join(" ")
    : description

  return (
    <p className="text-muted-foreground mt-2 break-words">
      {truncated}
      {isTruncated && (
        <span className="relative group/desc inline">
          <span className="cursor-pointer text-muted-foreground/70 hover:text-muted-foreground">
            ...
          </span>
          <span className="invisible group-hover/desc:visible absolute left-0 top-full mt-1 z-50 w-64 rounded-lg border bg-popover p-3 text-sm text-popover-foreground shadow-md break-words">
            {description}
          </span>
        </span>
      )}
    </p>
  )
}

// Split products into slides with 2 rows of 4 products each
const createSlides = (products: ISectionProduct[]) => {
  const slides = []
  const productsPerRow = 4
  const rowsPerSlide = 2
  const productsPerSlide = productsPerRow * rowsPerSlide

  for (let i = 0; i < products.length; i += productsPerSlide) {
    const slideProducts = products.slice(i, i + productsPerSlide)
    const row1 = slideProducts.slice(0, productsPerRow)
    const row2 = slideProducts.slice(productsPerRow, productsPerSlide)
    slides.push({ row1, row2 })
  }
  return slides
}

interface SectionCarouselProps {
  sectionItem: ISectionItem
}

const SectionCarousel = ({ sectionItem }: SectionCarouselProps) => {
  const t = useTranslations("Theme2.featured")
  const tCountdown = useTranslations("Theme2.countdown")
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [isCountdownComplete, setIsCountdownComplete] = useState(false)

  const { section, products, countdown } = sectionItem

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }

    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  const slides = createSlides(products)

  if (products.length === 0) return null

  const showCountdown =
    section.has_countdown && countdown?.end && !isCountdownComplete

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex md:items-center justify-between mb-8 max-md:flex-col max-md:items-center max-md:text-center max-md:gap-4 overflow-hidden">
          {/* Title - Left */}
          <div className="min-w-0 md:shrink-0 md:max-w-sm">
            <h2 className="text-xl md:text-4xl font-bold break-words">
              {section.name}
            </h2>
            {section.description && (
              <SectionDescription description={section.description} />
            )}
          </div>

          {/* Countdown - Center */}
          {showCountdown && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {tCountdown("endsIn")}
              </span>
              <CountdownTimer
                targetDate={countdown.end}
                variant="default"
                onComplete={() => setIsCountdownComplete(true)}
                labels={{
                  days: tCountdown("days"),
                  hours: tCountdown("hours"),
                  minutes: tCountdown("minutes"),
                  seconds: tCountdown("seconds"),
                  daysShort: tCountdown("daysShort"),
                  hoursShort: tCountdown("hoursShort"),
                  minutesShort: tCountdown("minutesShort"),
                  secondsShort: tCountdown("secondsShort"),
                  minsShort: tCountdown("minsShort"),
                  secsShort: tCountdown("secsShort"),
                  offerEnded: tCountdown("offerEnded"),
                }}
              />
            </div>
          )}

          {/* Buttons - Right */}
          <div className="flex items-center gap-4 shrink-0 flex-wrap max-md:justify-center">
            <Button
              size="lg"
              className="md:text-base font-semibold py-6"
              variant="secondary"
              asChild
            >
              <Link
                href={`/shop?section=${section.ulid}&sectionName=${encodeURIComponent(section.name)}`}
              >
                {t("seeAll")}
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                size="lg"
                className="md:text-base font-semibold py-6"
                variant="secondary"
              >
                <ChevronLeft className="size-6" />
                <span className="sr-only">{t("slidePrevious")}</span>
              </Button>
              <Button
                onClick={scrollNext}
                disabled={!canScrollNext}
                size="lg"
                className="md:text-base font-semibold py-6"
                variant="secondary"
              >
                <ChevronRight className="size-6" />
                <span className="sr-only">{t("slideNext")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel with 2 rows per slide */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="flex-[0_0_100%] min-w-0">
                {/* Row 1 */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-3 md:mb-6">
                  {slide.row1.map((product) => (
                    <SectionProductCard key={product.id} product={product} />
                  ))}
                </div>
                {/* Row 2 */}
                {slide.row2.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {slide.row2.map((product) => (
                      <SectionProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export const DynamicSections = () => {
  const sections = useSections((state) => state.sections)

  // Filter active sections and sort by order
  const activeSections = (sections ?? [])
    .filter((item) => item.section.is_active === true)
    .sort((a, b) => a.section.order - b.section.order)

  if (activeSections.length === 0) {
    return null
  }

  return (
    <>
      {activeSections.map((sectionItem) => (
        <SectionCarousel
          key={sectionItem.section.id}
          sectionItem={sectionItem}
        />
      ))}
    </>
  )
}
