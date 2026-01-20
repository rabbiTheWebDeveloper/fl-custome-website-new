"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Or use any icon library

// Demo slides with proper banner data
const demoSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=700&fit=crop",
    title: "Summer Collection 2024",
    subtitle: "Up to 50% Off on Selected Items",
    ctaText: "Shop Now",
    ctaLink: "/collection/summer",
    overlayColor: "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
    textColor: "text-white",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=700&fit=crop",
    title: "New Arrivals",
    subtitle: "Discover the Latest Trends",
    ctaText: "Explore",
    ctaLink: "/new-arrivals",
    overlayColor: "bg-gradient-to-r from-green-500/20 to-teal-500/20",
    textColor: "text-white",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=700&fit=crop",
    title: "Weekend Sale",
    subtitle: "Limited Time Offers",
    ctaText: "Grab Deals",
    ctaLink: "/deals/weekend",
    overlayColor: "bg-gradient-to-r from-red-500/20 to-orange-500/20",
    textColor: "text-white",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1920&h=700&fit=crop",
    title: "Free Shipping",
    subtitle: "On All Orders Over $50",
    ctaText: "Learn More",
    ctaLink: "/shipping-info",
    overlayColor: "bg-gradient-to-r from-yellow-500/20 to-pink-500/20",
    textColor: "text-gray-900",
  },
];

// Local fallback image
const PLACEHOLDER_BANNER = "/banner-placeholder.jpg";

export default function Banner({ slides = demoSlides }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: false,
      duration: 30,
      startIndex: 0,
    }
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // Autoplay effect with pause on hover
  useEffect(() => {
    if (!emblaApi || !isPlaying) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

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
  }, [emblaApi, isPlaying]);

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_BANNER;
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section 
      className="relative w-full mb-8 group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden w-full shadow-lg rounded-xl">
        {/* Embla container */}
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] w-full h-[400px] md:h-[500px] lg:h-[600px] cursor-pointer overflow-hidden rounded-xl"
            >
              {/* Background image */}
              <Image
                src={slide.image}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={handleImageError}
                unoptimized={slide.image.startsWith("https")}
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 ${slide.overlayColor}`} />

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-center px-4 max-w-4xl mx-auto ${slide.textColor}`}>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg animate-fadeIn">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md animate-fadeInUp">
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.ctaLink}
                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg animate-pulse-slow"
                  >
                    {slide.ctaText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows - only show on hover and for multiple slides */}
      {slideCount > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Pagination bullets */}
      {slideCount > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-125
                ${selectedIndex === index
                  ? "bg-white border-white scale-125"
                  : "bg-white/50 border-white/80 hover:bg-white/70"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Autoplay toggle button */}
      {slideCount > 1 && (
        <button
          onClick={toggleAutoplay}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg z-10 transition-colors duration-300"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <span className="flex items-center justify-center w-6 h-6">⏸️</span>
          ) : (
            <span className="flex items-center justify-center w-6 h-6">▶️</span>
          )}
        </button>
      )}

      {/* Progress bar */}
      {slideCount > 1 && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent z-10">
          <div 
            className="h-full bg-white transition-all duration-5000 ease-linear"
            style={{ 
              width: `${(selectedIndex + 1) * (100 / slideCount)}%`,
              animation: 'progress 5s linear infinite'
            }}
          />
        </div>
      )}
    </section>
  );
}