import { api } from "@/lib/api-client"
import { getDomainHeaders } from "@/lib/domain"
import { IProductsApiResponse } from "../types/product"
import { ICategoriesApiResponse } from "../types/categories"
import { ShopContent } from "../_components/shop/shop-content"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ catId?: string; search?: string }>
}) {
  const headers = await getDomainHeaders()
  const { catId, search } = await searchParams

  // Fetch products based on search query or default to all products
  let response: IProductsApiResponse
  if (search && search.trim()) {
    // Use search API when search query is present
    const searchResponse = await api.get<IProductsApiResponse>(
      `/customer/product-search?search=${encodeURIComponent(search.trim())}&page=1`,
      undefined,
      {
        headers,
      }
    )
    response = searchResponse.data
  } else {
    // Use regular products API when no search query
    const productsResponse = await api.getTyped<
      "/customer/products",
      IProductsApiResponse
    >("/customer/products", {
      headers,
    })
    // getTyped returns the response data, which is IProductsApiResponse
    response = productsResponse as IProductsApiResponse
  }

  const responseCategories = await api.getTyped<
    "/customer/categories",
    ICategoriesApiResponse
  >("/customer/categories", {
    headers,
  })

  const products = Array.isArray(response?.data) ? response.data : []
  const initialPagination = {
    current_page: response?.current_page ?? 1,
    last_page: response?.last_page ?? 1,
    next_page_url: response?.next_page_url ?? null,
    per_page: response?.per_page ?? 0,
    total: response?.total ?? 0,
  }
  const categories = Array.isArray(responseCategories.data)
    ? responseCategories.data
    : []

  return (
    <main>
      <div className="container py-16 px-1 md:px-2">
        <ShopContent
          initialProducts={products}
          initialPagination={initialPagination}
          categories={categories}
          headers={headers}
          initialCategoryId={catId ? Number(catId) : null}
          initialSearchQuery={search || null}
        />
      </div>
    </main>
  )
}
