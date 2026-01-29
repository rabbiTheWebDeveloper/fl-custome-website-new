import { api } from "@/lib/api-client"
import { IProductsApiResponse } from "@/app/(theme-2)/th_2/types/product"

/**
 * Fetches products for a specific category
 * @param categoryId - The category ID to fetch products for
 * @param headers - API headers containing shop-id and user-id
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with full API response including pagination
 */
export async function getCategoryProducts(
  categoryId: number | string,
  headers: {
    "shop-id": string
    "user-id": string
  },
  page: number = 1
): Promise<IProductsApiResponse> {
  try {
    const response = await api.get<IProductsApiResponse>(
      `/customer/category-product/list/${categoryId}?page=${page}`,
      undefined,
      {
        headers,
      }
    )
    return response.data
  } catch (error) {
    console.error(`Failed to fetch products for category ${categoryId}:`, error)
    return {
      message: "error",
      success: false,
      error_type: "",
      execution_time: 0,
      current_page: 1,
      data: [],
      first_page_url: "",
      from: 0,
      last_page: 1,
      last_page_url: "",
      links: [],
      next_page_url: null,
      path: "",
      per_page: 0,
      prev_page_url: null,
      to: 0,
      total: 0,
    }
  }
}

/**
 * Fetches all products with pagination
 * @param headers - API headers containing shop-id and user-id
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with full API response including pagination
 */
export async function getAllProducts(
  headers: {
    "shop-id": string
    "user-id": string
  },
  page: number = 1
): Promise<IProductsApiResponse> {
  try {
    const response = await api.get<IProductsApiResponse>(
      `/customer/products?page=${page}`,
      undefined,
      {
        headers,
      }
    )
    return response.data
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return {
      message: "error",
      success: false,
      error_type: "",
      execution_time: 0,
      current_page: 1,
      data: [],
      first_page_url: "",
      from: 0,
      last_page: 1,
      last_page_url: "",
      links: [],
      next_page_url: null,
      path: "",
      per_page: 0,
      prev_page_url: null,
      to: 0,
      total: 0,
    }
  }
}

/**
 * Fetches products based on search query with pagination
 * @param searchQuery - The search query string
 * @param headers - API headers containing shop-id and user-id
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with full API response including pagination
 */
export async function searchProducts(
  searchQuery: string,
  headers: {
    "shop-id": string
    "user-id": string
  },
  page: number = 1
): Promise<IProductsApiResponse> {
  try {
    const response = await api.get<IProductsApiResponse>(
      `/customer/product-search?search=${encodeURIComponent(searchQuery)}&page=${page}`,
      undefined,
      {
        headers,
      }
    )
    return response.data
  } catch (error) {
    console.error(`Failed to search products for "${searchQuery}":`, error)
    return {
      message: "error",
      success: false,
      error_type: "",
      execution_time: 0,
      current_page: 1,
      data: [],
      first_page_url: "",
      from: 0,
      last_page: 1,
      last_page_url: "",
      links: [],
      next_page_url: null,
      path: "",
      per_page: 0,
      prev_page_url: null,
      to: 0,
      total: 0,
    }
  }
}
