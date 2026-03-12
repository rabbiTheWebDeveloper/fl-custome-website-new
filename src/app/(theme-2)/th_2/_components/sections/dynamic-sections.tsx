"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { trackAddToCart } from "@/lib/gtm"

interface SectionProductCardProps {
  product: ISectionProduct
}

const SectionProductCard = ({ product }: SectionProductCardProps) => {
  const t = useTranslations("Theme2.buttons")
  const tToast = useTranslations("Theme2.toast")
  const router = useRouter()
  const { addItem, getItemByProduct } = useCart()
  const [isAdding, setIsAdding] = useState(false)

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

    setIsAdding(true)
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
      trackAddToCart({
        id: product.id,
        name: product.product_name,
        price: product.discounted_price ?? product.price,
        quantity: 1,
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast.error(tToast("addToCartError"))
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div
      className="group relative cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-lg border border-border bg-card p-2"
      onClick={() => {
        if (product.ulid)
          router.push(`/product/${product.slug}?id=${product.ulid}`)
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (product.ulid)
            router.push(`/product/${product.slug}?id=${product.ulid}`)
        }
      }}
    >
      {/* Product Image Container */}
      <div
        className={cn(
          "relative aspect-square rounded-md overflow-hidden bg-muted",
          isStockOut && "opacity-60 grayscale"
        )}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#FFA01C] text-black text-xs md:text-sm font-semibold px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg">
              {discountLabel} OFF
            </span>
          </div>
        )}

        {/* Stock Out Badge */}
        {isStockOut && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-600 text-white text-xs md:text-sm font-semibold px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg">
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

        {/* Add to Cart Button - always visible on mobile, hover on desktop */}
        {!isStockOut && (
          <div className="absolute bottom-2 left-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="w-full bg-white text-black hover:bg-gray-100 rounded-lg text-xs md:text-sm py-2"
              onClick={handleAddToCart}
              disabled={isAtMax || isAdding}
            >
              {isAdding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isAtMax ? (
                t("maxQuantity")
              ) : (
                t("addToCart")
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 pt-2">
        <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-2">
          {product.product_name}
        </h3>
        <div className="flex items-center gap-2">
          {originalPrice > discountedPrice ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
              <span className="text-base md:text-lg font-semibold text-primary">
                ৳{discountedPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-base md:text-lg font-semibold text-primary">
              ৳{originalPrice.toLocaleString()}
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

// Split products into slides with 2 rows of 5 products each
const createSlides = (products: ISectionProduct[]) => {
  const slides = []
  const productsPerRow = 5
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

  const countdownTimer = showCountdown ? (
    <CountdownTimer
      targetDate={countdown.end}
      variant="inline"
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
  ) : null

  const headerActions = (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        size="sm"
        className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-semibold px-4 py-2 rounded-sm shadow-sm"
        asChild
      >
        <Link
          href={`/shop?section=${section.ulid}&sectionName=${encodeURIComponent(section.name)}`}
        >
          {t("seeAll")}
        </Link>
      </Button>
      <div className="flex gap-1">
        <Button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          size="icon"
          variant="ghost"
          className="size-8 text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">{t("slidePrevious")}</span>
        </Button>
        <Button
          onClick={scrollNext}
          disabled={!canScrollNext}
          size="icon"
          variant="ghost"
          className="size-8 text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">{t("slideNext")}</span>
        </Button>
      </div>
    </div>
  )

  return (
    <section className="py-4 md:py-6">
      <div className="container">
        {/* Header Bar */}
        <div className="bg-primary/70 border-b border-border rounded-t-xl px-4 py-3 md:px-6 md:py-4">
          <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-4">
            <h2 className="text-lg md:text-2xl font-bold text-white whitespace-nowrap">
              {section.name}
            </h2>
            <div className="flex justify-center">{countdownTimer}</div>
            {headerActions}
          </div>

          <div className="md:hidden space-y-2">
            {showCountdown && (
              <div className="flex justify-center">{countdownTimer}</div>
            )}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white min-w-0 truncate">
                {section.name}
              </h2>
              {headerActions}
            </div>
          </div>
        </div>

        {/* Product Grid with border */}
        <div className="border border-t-0 border-border rounded-b-xl p-3 md:p-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, slideIndex) => (
                <div key={slideIndex} className="flex-[0_0_100%] min-w-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-3 md:mb-4">
                    {slide.row1.map((product) => (
                      <SectionProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {slide.row2.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                      {slide.row2.map((product) => (
                        <SectionProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description below */}
        {section.description && (
          <div className="mt-3">
            <SectionDescription description={section.description} />
          </div>
        )}
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
