"use client";

import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

// Category icon size
const CATEGORY_ICON_SIZE = 80;

// Demo categories with diverse sample data
const demoCategories = [
  {
    id: 1,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 42,
  },
  {
    id: 2,
    name: "Fashion & Apparel",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 128,
  },
  {
    id: 3,
    name: "Home & Garden",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 76,
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 54,
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    image: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 31,
  },
  {
    id: 6,
    name: "Books & Stationery",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 89,
  },
  {
    id: 7,
    name: "Toys & Games",
    image: "https://images.unsplash.com/photo-1587654780298-8ded9cec9e52?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 63,
  },
  {
    id: 8,
    name: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    shop_id: 1,
    product_count: 47,
  },
];

// Local fallback image (create this in your public folder)
const PLACEHOLDER_IMAGE = "/placeholder-category.png";

export default function Category({ categories = demoCategories }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    skipSnaps: false,
    slidesToScroll: "auto",
    containScroll: "trimSnaps"
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const slides = useMemo(() => {
    return categories.map((it) => {
      const categorySlug = encodeURIComponent((it.name || "").split(" ").join("-"));
      const href = `/shop?category=${categorySlug}&shop=${it?.shop_id}&id=${it?.id}`;
      return { ...it, href };
    });
  }, [categories]);

  // Autoplay effect
  useEffect(() => {
    if (!emblaApi) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    const onInit = () => {
      setSlideCount(emblaApi.slideNodes().length);
    };

    emblaApi.on("init", onInit);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);
    
    onInit();
    onSelect();

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
      emblaApi.off("init", onInit);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi]);

  const truncate = (str: string, maxLen = 28) => {
    if (!str) return "";
    return str.length > maxLen ? str.slice(0, maxLen - 1) + "…" : str;
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Categories</h2>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6 py-2">
              {slides.map((item) => (
                <div
                  key={item.id}
                  className="flex-[0_0_140px] sm:flex-[0_0_160px] md:flex-[0_0_180px] flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
                >
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 mb-3 flex items-center justify-center rounded-full overflow-hidden border-2 border-gray-100 p-1"
                  >
                    <Image
                      src={item.image}
                      alt={item.name || "category"}
                      width={CATEGORY_ICON_SIZE}
                      height={CATEGORY_ICON_SIZE}
                      className="object-cover w-full h-full rounded-full"
                      onError={handleImageError}
                      unoptimized={item.image.startsWith("https")}
                    />
                  </div>

                  <Link href={item.href} className="w-full group">
                    <h5 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {truncate(item.name)}
                    </h5>
                  </Link>

                  {item.product_count ? (
                    <span className="mt-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                      {item.product_count} items
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination bullets - only show if multiple slides */}
          {slideCount > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: slideCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedIndex === index 
                      ? "bg-blue-600 w-6" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to category ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}