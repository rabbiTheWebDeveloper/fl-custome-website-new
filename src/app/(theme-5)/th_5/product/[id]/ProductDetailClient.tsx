"use client"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Star,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Share2,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { IProduct, IVariation, IAttributeValues } from "../../types/product"
import { useCartStore } from "@/lib/cart"
import { useCart, generateCartItemId } from "@/lib/cart"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { tagManagerEvent } from "@/lib/tag-manager-event"
import { trackAddToCart } from "@/lib/gtm"

/* ── helpers ─────────────────────────────────────── */
const normalize = (v: string) => v.trim().toLowerCase()
const normComp = (v: string) => normalize(v).replace(/[^a-z0-9]/g, "")

function getDefaultAttrs(attrs: IAttributeValues[]) {
  return attrs.reduce<Record<string, string>>((a, at) => {
    const f = at.values[0]?.value
    if (f) a[at.key] = f
    return a
  }, {})
}
function getCheapest(vars: IVariation[]) {
  return vars.reduce<IVariation | null>(
    (l, c) => (!l ? c : c.price < l.price ? c : l),
    null
  )
}
function mapVarToAttrs(v: IVariation, attrs: IAttributeValues[]) {
  const m: Record<string, string> = {}
  if (!attrs.length) return m
  if (attrs.length === 1) {
    const a = attrs[0]
    const ex = a.values.find(
      (val) => normComp(val.value) === normComp(v.variant)
    )
    m[a.key] = ex?.value ?? v.variant
    return m
  }
  const vl = normComp(v.variant)
  attrs.forEach((a) => {
    const match = a.values.find((val) => vl.includes(normComp(val.value)))
    if (match) m[a.key] = match.value
  })
  return m
}
function doesVarMatch(
  v: IVariation,
  attrs: IAttributeValues[],
  sel: Record<string, string>
) {
  const mapped = mapVarToAttrs(v, attrs)
  return attrs.every((a) => {
    const s = sel[a.key]
    if (!s) return true
    return normComp(mapped[a.key] ?? "") === normComp(s)
  })
}

/* ── main component ──────────────────────────────── */
interface Props {
  product: IProduct
  videoUrls: string[]
  relatedProducts?: IProduct[]
}

export default function ProductDetailClient({
  product,
  videoUrls,
  relatedProducts = [],
}: Props) {
  const router = useRouter()
  const { addItem } = useCart()
  const items = useCartStore((s) => s.items)

  // --- attributes / variations ---
  const attributes = useMemo<IAttributeValues[]>(
    () =>
      Array.isArray(product.attributes)
        ? (product.attributes as IAttributeValues[])
        : [],
    [product.attributes]
  )
  const variations = useMemo<IVariation[]>(
    () =>
      Array.isArray(product.variations)
        ? (product.variations as IVariation[])
        : [],
    [product.variations]
  )
  const hasVariations = variations.length > 0 && attributes.length > 0
  const cheapest = useMemo(() => getCheapest(variations), [variations])

  const initSel = useMemo(() => {
    const d = getDefaultAttrs(attributes)
    if (!hasVariations || !cheapest) return d
    return { ...d, ...mapVarToAttrs(cheapest, attributes) }
  }, [attributes, hasVariations, cheapest])

  const [selectedVariants, setSelectedVariants] =
    useState<Record<string, string>>(initSel)
  useEffect(() => {
    setSelectedVariants(initSel)
  }, [initSel])

  const selectedVariation = useMemo(() => {
    if (!hasVariations) return null
    return (
      variations.find((v) => doesVarMatch(v, attributes, selectedVariants)) ??
      cheapest
    )
  }, [hasVariations, variations, attributes, selectedVariants, cheapest])

  // --- pricing ---
  const selectedPrice = hasVariations
    ? (selectedVariation?.price ?? cheapest?.price ?? product.price)
    : product.price > product.discounted_price
      ? product.discounted_price
      : product.price

  const hasDiscount = product.price > product.discounted_price
  const discountPct = hasDiscount
    ? Math.round(
        ((product.price - product.discounted_price) / product.price) * 100
      )
    : 0
  const isStockOut = hasVariations
    ? (selectedVariation?.quantity ?? 0) <= 0
    : product.product_qty <= 0

  // --- images ---
  const selectedMainImage = selectedVariation?.media || product.main_image || ""
  const allImages = [
    selectedMainImage,
    ...product.other_images.filter((i) => i !== selectedMainImage),
  ].filter(Boolean)
  const [activeIdx, setActiveIdx] = useState(0)
  const [imgZoom, setImgZoom] = useState(false)

  // --- quantity ---
  const [qty, setQty] = useState(1)
  const maxQty = selectedVariation?.quantity ?? product.product_qty

  // --- cart ---
  const cartVariants = useMemo(() => {
    const vars = Array.isArray(product.variations)
      ? (product.variations as IVariation[])
      : []
    return Object.entries(selectedVariants)
      .filter(([, v]) => v)
      .map(([key, value]) => {
        const mv = vars.find((vr) => vr.variant === value)
        const rid = selectedVariation?.id ?? mv?.id
        return {
          key,
          value,
          variationId: rid,
          variantId: rid,
          attributeId: rid,
        }
      })
  }, [product.variations, selectedVariants, selectedVariation?.id])

  const currentCartItem = useMemo(() => {
    const id = generateCartItemId(product.id, cartVariants)
    return items.find((i) => i.id === id)
  }, [items, product.id, cartVariants])

  const effectivePrice = selectedVariation?.price ?? product.discounted_price
  const effectiveImage = selectedVariation?.media || product.main_image

  const [adding, setAdding] = useState(false)

  const handleAddToCart = useCallback(async () => {
    if (isStockOut) {
      toast.error("Out of stock")
      return
    }
    setAdding(true)
    try {
      await addItem({
        productId: product.id,
        name: product.product_name,
        price: effectivePrice,
        discountedPrice: effectivePrice,
        quantity: qty,
        variants: cartVariants,
        metadata: {
          image: effectiveImage,
          sku: product.product_code,
          maxQuantity: maxQty,
          ulid: product.ulid,
          inside_dhaka: product.inside_dhaka,
          outside_dhaka: product.outside_dhaka,
          sub_area_charge: product.sub_area_charge,
        },
        mergeIfExists: true,
        maxQuantity: maxQty,
      })
      trackAddToCart({
        id: product.id,
        name: product.product_name,
        price: effectivePrice,
        quantity: qty,
      })
      toast.success("Added to cart!", { description: product.product_name })
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setAdding(false)
    }
  }, [
    addItem,
    cartVariants,
    effectiveImage,
    effectivePrice,
    isStockOut,
    maxQty,
    product,
    qty,
  ])

  const handleBuyNow = useCallback(async () => {
    if (isStockOut) {
      toast.error("Out of stock")
      return
    }
    if (!currentCartItem) await handleAddToCart()
    router.push("/checkout")
  }, [currentCartItem, handleAddToCart, isStockOut, router])

  // --- tracking ---
  const lastTracked = useRef<number | null>(null)
  useEffect(() => {
    if (!product?.id || lastTracked.current === product.id) return
    tagManagerEvent("view_item", selectedPrice, product, "single_item")
    lastTracked.current = product.id
  }, [product, selectedPrice])

  // --- tabs ---
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  )

  // --- share ---
  const [showShare, setShowShare] = useState(false)

  const related = relatedProducts.length
    ? relatedProducts
    : (product.relatedProducts ?? product.related_products ?? [])

  return (
    <main className="min-h-screen bg-white w-full">
      {/* ── TOP SECTION: Gallery + Info ─────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight size={10} />
          <span className="text-gray-600 truncate max-w-[200px]">
            {product.product_name}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
          {/* === LEFT: Gallery === */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4">
            {/* TRENDING badge */}
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#b8860b] border border-[#b8860b] px-3 py-1">
                  TRENDING
                </span>
              </div>
            )}

            {/* Main image */}
            <div
              className="relative w-full aspect-square bg-[#f7f7f7] overflow-hidden cursor-zoom-in group"
              onClick={() => setImgZoom(!imgZoom)}
            >
              {allImages[activeIdx] ? (
                <Image
                  src={allImages[activeIdx]}
                  alt={`${product.product_name} - ${activeIdx + 1}`}
                  fill
                  priority
                  className={`object-contain p-4 md:p-8 transition-transform duration-700 ${imgZoom ? "scale-150" : "group-hover:scale-105"}`}
                />
              ) : videoUrls[0] ? (
                <iframe
                  src={videoUrls[0]}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ShoppingBag size={48} strokeWidth={1} />
                </div>
              )}
              {/* Discount badge on image */}
              {hasDiscount && (
                <span className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold px-3 py-1">
                  -{discountPct}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveIdx(idx)
                      setImgZoom(false)
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 overflow-hidden transition-all ${activeIdx === idx ? "border-black" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
                {videoUrls.map((_, idx) => (
                  <button
                    key={`v-${idx}`}
                    onClick={() => setActiveIdx(allImages.length + idx)}
                    className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-200 hover:border-gray-400 bg-black flex items-center justify-center"
                  >
                    <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-black ml-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === RIGHT: Product Info === */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-28 self-start flex flex-col gap-5">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 uppercase leading-tight">
              {product.product_name}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className="text-[#b8860b] fill-[#b8860b]"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">5.0</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                ৳ {selectedPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-base text-gray-400 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-bold text-red-500">
                  Save {discountPct}%
                </span>
              )}
            </div>

            {/* Stock status */}
            <div
              className={`flex items-center gap-2 text-sm font-medium ${isStockOut ? "text-red-500" : "text-emerald-600"}`}
            >
              {isStockOut ? (
                <>
                  <Package size={14} /> Out of Stock
                </>
              ) : (
                <>
                  <Check
                    size={14}
                    className="bg-emerald-600 text-white rounded-full p-0.5"
                  />{" "}
                  In Stock — Ready to Ship
                </>
              )}
            </div>

            {/* Delivery info banner */}
            <div className="bg-[#faf8f0] border border-[#e8e0c8] p-4 flex items-center gap-3 text-xs text-gray-700">
              <Truck size={18} className="text-[#b8860b] flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  Premium Delivery Available
                </p>
                <p className="text-gray-500 mt-0.5">
                  Cash on delivery • Free returns within 7 days
                </p>
              </div>
            </div>

            {/* VARIANT SELECTOR */}
            {hasVariations && attributes.length > 0 && (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-900">
                  Exclusive Discount
                </p>
                {attributes.map((attr) => (
                  <div key={attr.key}>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {attr.key}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((val) => {
                        const isActive =
                          selectedVariants[attr.key] === val.value
                        return (
                          <button
                            key={val.id}
                            onClick={() => {
                              setSelectedVariants((p) => ({
                                ...p,
                                [attr.key]: val.value,
                              }))
                              setActiveIdx(0)
                            }}
                            className={`px-4 py-2 text-xs font-semibold border transition-all ${isActive ? "border-black bg-black text-white" : "border-gray-300 text-gray-700 hover:border-black"}`}
                          >
                            {val.value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-stretch gap-3">
                {/* Qty */}
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 h-11 flex items-center justify-center text-sm font-semibold border-x border-gray-300">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="w-10 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isStockOut || adding}
                  className="flex-1 bg-[#b8860b] hover:bg-[#9a7209] text-white text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {adding ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingBag size={14} />
                  )}
                  {isStockOut ? "Sold Out" : "Add to Cart"}
                </button>
              </div>
              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={isStockOut}
                className="w-full bg-black hover:bg-gray-900 text-white text-xs font-bold uppercase tracking-widest py-3.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Buy Now <ArrowRight size={14} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: Truck, label: "Fast Delivery", sub: "7-10 days" },
                { icon: RotateCcw, label: "7 Days Return", sub: "Money back" },
                {
                  icon: ShieldCheck,
                  label: "Premium Quality",
                  sub: "Guaranteed",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5 py-3 border border-gray-100 rounded"
                >
                  <Icon size={18} className="text-gray-600" />
                  <p className="text-[10px] font-bold text-gray-800 leading-tight">
                    {label}
                  </p>
                  <p className="text-[9px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowShare(!showShare)}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Share2 size={14} /> Share this product
              </button>
              {showShare && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success("Link copied!")
                    }}
                    className="text-[10px] px-3 py-1 border border-gray-300 hover:bg-gray-100 rounded"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>

            {/* Short description */}
            {product.short_description &&
              product.short_description.trim() !== "" && (
                <div
                  className="text-sm text-gray-600 leading-relaxed border-l-2 border-[#b8860b] pl-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}
          </div>
        </div>
      </div>

      {/* ── DESCRIPTION / REVIEWS TABS ──────────────────── */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {(["description", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[1px] ${activeTab === tab ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {tab === "description" ? "Description" : "Customer Reviews"}
              </button>
            ))}
          </div>
          {activeTab === "description" && product.long_description && (
            <div
              className="prose prose-sm max-w-4xl mx-auto prose-img:rounded-lg prose-p:leading-relaxed prose-p:text-gray-600 prose-headings:font-bold"
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />
          )}
          {activeTab === "description" && !product.long_description && (
            <p className="text-gray-400 text-sm text-center py-8">
              No description available.
            </p>
          )}
          {activeTab === "reviews" && (
            <div className="text-center py-12">
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    className="text-[#b8860b] fill-[#b8860b]"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Be the first to review this product
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── RELATED PRODUCTS / PRIME DROP ────────────────── */}
      {related.length > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
            <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight uppercase mb-10">
              The Prime Drop
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.slice(0, 8).map((rp) => {
                const rPrice =
                  rp.price > rp.discounted_price
                    ? rp.discounted_price
                    : rp.price
                const rHasDisc = rp.price > rp.discounted_price
                const rDiscPct = rHasDisc
                  ? Math.round(
                      ((rp.price - rp.discounted_price) / rp.price) * 100
                    )
                  : 0
                return (
                  <Link
                    key={rp.id}
                    href={`/product/${rp.ulid}?${rp.slug}`}
                    className="group flex flex-col bg-white border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="relative aspect-square bg-[#f7f7f7] overflow-hidden">
                      {rHasDisc && (
                        <span className="absolute top-2 left-2 z-10 bg-[#b8860b] text-white text-[9px] font-bold px-2 py-0.5">
                          SAVE {rDiscPct}%
                        </span>
                      )}
                      {rp.main_image ? (
                        <Image
                          src={rp.main_image}
                          alt={rp.product_name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <h3 className="text-[11px] font-semibold text-gray-900 uppercase line-clamp-2 leading-snug">
                        {rp.product_name}
                      </h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold">
                          ৳{rPrice.toLocaleString()}
                        </span>
                        {rHasDisc && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ৳{rp.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/shop"
                className="inline-block border-2 border-black text-black px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── FEATURES STRIP ──────────────────────────────── */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Get your order within 7-10 days",
              },
              {
                icon: RotateCcw,
                title: "7 Days Return",
                desc: "Money back guaranteed",
              },
              {
                icon: Star,
                title: "Emerging Trend",
                desc: "Stay on-trend with us",
              },
              {
                icon: ShieldCheck,
                title: "Premium Quality",
                desc: "Experience luxury with every purchase",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gray-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    {title}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
