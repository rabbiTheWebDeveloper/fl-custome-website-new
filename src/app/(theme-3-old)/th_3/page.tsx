import Banner from "./_components/banner"
import Category from "./_components/category"
import MiddleBanner from "./_components/middle-banner"
import AllProduct from "./_components/all-product"
import Scroll from "./_components/Scroll"
import { getDomainHeaders } from "@/lib/domain"
import { api } from "@/lib/api-client"
import { IProductsApiResponse } from "./types/product"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  // await searchParams before using it
  const { page = "1" } = await searchParams

  const headers = await getDomainHeaders()
  const { data: response } = await api.get<IProductsApiResponse>(
    `/customer/products?page=${page}`,
    { headers }
  )

  const products = response.data
  const totalPages = response.last_page

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-500">
      {/* Decorative blobs */}
      <div
        className="blob blob-1 fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-60 blur-[80px] -z-10
               bg-[radial-gradient(circle,rgb(224,231,255)_0%,rgba(255,255,255,0)_70%)]
               dark:bg-[radial-gradient(circle,rgb(55,65,81)_0%,rgba(0,0,0,0)_70%)]"
      />
      <div
        className="blob blob-2 fixed bottom-0 right-[-10%] w-[600px] h-[600px] rounded-full opacity-60 blur-[80px] -z-10
               bg-[radial-gradient(circle,rgb(255,228,230)_0%,rgba(255,255,255,0)_70%)]
               dark:bg-[radial-gradient(circle,rgb(139,92,246)_0%,rgba(0,0,0,0)_70%)]"
      />

      {/* Sections */}
      <Banner />
      <Category />
      <MiddleBanner />
      <AllProduct products={products} totalPages={totalPages} />
      <Scroll />
    </div>
  )
}
