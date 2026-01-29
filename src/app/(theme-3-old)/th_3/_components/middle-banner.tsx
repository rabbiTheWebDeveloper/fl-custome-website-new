"use client"
import Image from "next/image"
import Link from "next/link"
import { useDomain } from "../store/domain"
import { useEffect } from "react"
import { api } from "@/lib/api-client"
import { useState } from "react"
import { IBannerApiResponse, IBannerItem } from "../types/banner"
const MiddleBanner = () => {
  const domain = useDomain((state) => state.domain)
  const [banners, setBanners] = useState<IBannerItem[]>()
  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await api.get<IBannerApiResponse>(
          "/shops/media/content?type=banner",
          {
            headers: {
              "shop-id": String(domain?.shop_id) ?? "",
            },
          }
        )
        if (res.data.success) {
          setBanners(res?.data?.data)
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error)
      }
    }
    getBanners()
  }, [domain?.shop_id])
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners?.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full aspect-[16/9] bg-gray-200">
                <Image
                  src={banner.image}
                  alt={banner.image}
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
  )
}

export default MiddleBanner
