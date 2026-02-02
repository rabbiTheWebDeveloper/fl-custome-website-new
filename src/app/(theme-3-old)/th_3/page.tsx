import Banner from "./_components/banner"
import Category from "./_components/category"
import MiddleBanner from "./_components/middle-banner"
import AllProduct from "./_components/all-product"
import Scroll from "./_components/Scroll"
import { getDomainHeaders } from "@/lib/domain"
import { api } from "@/lib/api-client"
import { IProductsApiResponse } from "@/type"
export const dynamic = 'force-dynamic';


export default async function Home({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page ?? 1)
  const headers = await getDomainHeaders()
  const response = await api.getTyped<IProductsApiResponse>(
    `/customer/products?page=${currentPage}`,
    { headers }
  )

  console.log('response', response);
 const products = response.data as Product[];
 const totalPages = response.last_page as number;

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-[#111] overflow-x-hidden">
      <div className="blob blob-1 fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-60 blur-[80px] -z-10 bg-[radial-gradient(circle,rgb(224,231,255)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="blob blob-2 fixed bottom-0 right-[-10%] w-[600px] h-[600px] rounded-full opacity-60 blur-[80px] -z-10 bg-[radial-gradient(circle,rgb(255,228,230)_0%,rgba(255,255,255,0)_70%)]" />

      <Banner />
      <Category />
      <MiddleBanner />
      <AllProduct products={products} totalPages={totalPages} />
      <Scroll />
    </div>
  )
}
