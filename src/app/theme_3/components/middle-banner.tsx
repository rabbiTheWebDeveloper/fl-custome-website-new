import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Zap } from "lucide-react";
const sampleBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h-800&fit=crop",
    alt: "Summer Sale 2024",
    title: "Summer Collection",
    subtitle: "Up to 50% Off",
    description: "Discover the hottest trends of the season",
    link: "/collections/summer-sale",
    ctaText: "Shop Now",
    theme: "bg-gradient-to-br from-amber-400/20 to-orange-500/20",
    textColor: "text-gray-900",
    badge: {
      text: "Limited Time",
      color: "bg-red-500",
    },
    icon: ShoppingBag,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&h=800&fit=crop",
    alt: "Electronics Flash Sale",
    title: "Tech Deals",
    subtitle: "Flash Sale Ends Soon",
    description: "Premium electronics at unbeatable prices",
    link: "/categories/electronics",
    ctaText: "Grab Deals",
    theme: "bg-gradient-to-br from-blue-400/20 to-cyan-500/20",
    textColor: "text-gray-900",
    badge: {
      text: "24 Hours Only",
      color: "bg-green-500",
    },
    icon: Zap,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=1200&h=800&fit=crop",
    alt: "Home & Living",
    title: "Home Refresh",
    subtitle: "Home Essentials Sale",
    description: "Transform your living space",
    link: "/categories/home-living",
    ctaText: "Discover",
    theme: "bg-gradient-to-br from-emerald-400/20 to-teal-500/20",
    textColor: "text-white",
    badge: {
      text: "Popular",
      color: "bg-amber-500",
    },
    icon: null,
  }
]

const MiddleBanner = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBanners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full aspect-[16/9] bg-gray-200">
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MiddleBanner;
