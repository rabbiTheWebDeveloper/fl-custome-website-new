// app/(theme-3-old)/th_3/@modal/(.)product/[id]/page.tsx
import { getDomainHeaders } from "@/lib/domain"
import { api } from "@/lib/api-client"
import { IProduct } from "@/app/(theme-3-old)/th_3/types/product"
import Modal from "@/app/(theme-3-old)/th_3/_components/product/Modal"
import ProductDescription from "@/app/(theme-3-old)/th_3/_components/product-description"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Details = async ({ params, searchParams }: PageProps) => {
  const { id } = await params
  const headers = await getDomainHeaders()

  let product: IProduct | null = null

  try {
    const response = await api.get(`/customer/products/${id}`, {
      headers,
    })
    product = (response.data as { data: IProduct }).data
  } catch {
    // Error handled by null check below
  }

  if (!product) {
    return (
      <Modal>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <p className="text-red-500">Failed to load product</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal>
      <ProductDescription product={product} />
    </Modal>
  )
}

export default Details
