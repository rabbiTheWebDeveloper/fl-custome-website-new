/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "@/config/ApiEndpoints"
import { headerHostNname, hostDomain, NEXT_REVALIDATE_TIME } from "@/constant"
import { api } from "@/lib/api-client"

export const getOtherData = async (shopId: string, typeOfPage: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.getTyped<any>(
    `/shops/content?type=${typeOfPage}`,
    {
      headers: {
        "shop-id": shopId,
      },
    }
  )

  const { data }: any = response
  return data
}

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number
  }
}

interface DomainInfo {
  shop_id?: string
  user_id?: string
  domain_verify?: string
  domain?: string
  shop_meta_title?: string
  shop_meta_description?: string
  shop_logo?: string
  theme_id?: string
  fb_pixel?: string
}

interface ApiResponse<T = any> {
  data?: T
}

/* =====================
   Fetch Helper
===================== */

const fetchAPI = async <T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T> | null> => {
  try {
    const res = await fetch(url, options)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    return res.json()
  } catch (err: any) {
    console.error(`[fetchAPI] ${err.message}`)
    return null
  }
}

interface BuildHeaderParams {
  host?: string
  shopId?: string
  userId?: string
}

const buildHeaders = ({ host, shopId, userId }: BuildHeaderParams) => {
  const headers: Record<string, string> = {}

  if (host) headers.domain = host === hostDomain ? headerHostNname : host
  if (shopId) headers["shop-id"] = shopId

  if (userId) {
    headers.id = userId
    headers["X-Requested-With"] = "XMLHttpRequest"
  }

  return headers
}

export const getDomainInfo = async (
  host: string
): Promise<DomainInfo | null> => {
  const domainHeader = host === hostDomain ? headerHostNname : host
  const data = await fetchAPI<DomainInfo>(
    `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.SHOP.DOMAIN}`,
    {
      headers: {
        domain: domainHeader,
      },
      next: {
        revalidate: 600,
      },
    }
  )

  return data?.data || null
}

export const getData = async (host: string) => {
  try {
    const domainInfo = await getDomainInfo(host)

    if (!domainInfo?.shop_id) {
      return {
        ...domainInfo,
        slider: [],
        banner: [],
        category: [],
      }
    }

    const shopHeaders = buildHeaders({
      shopId: domainInfo.shop_id,
    })

    const [sliderData, bannerData, categoryData] = await Promise.all([
      fetchAPI<any[]>(
        `${API_ENDPOINTS.BASE_URL}/shops/media/content?type=slider`,
        {
          headers: shopHeaders,
          cache: "force-cache",
          next: { revalidate: NEXT_REVALIDATE_TIME },
        }
      ),
      fetchAPI<any[]>(
        `${API_ENDPOINTS.BASE_URL}/shops/media/content?type=banner`,
        {
          headers: shopHeaders,
          cache: "force-cache",
          next: { revalidate: NEXT_REVALIDATE_TIME },
        }
      ),
      fetchAPI<any[]>(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}`,
        {
          headers: shopHeaders,
          cache: "force-cache",
          next: { revalidate: NEXT_REVALIDATE_TIME },
        }
      ),
    ])

    return {
      ...domainInfo,
      slider: sliderData?.data || [],
      banner: bannerData?.data || [],
      category: categoryData?.data || [],
    }
  } catch (err) {
    console.error("[getData] Error:", err)
    return null
  }
}

export const getProductDetailsData = async (
  host: string,
  productId?: string
) => {
  try {
    const domainInfo = await getDomainInfo(host)

    if (!domainInfo?.shop_id) {
      return {
        shopInfo: {},
        product: {},
        orderPermision: null,
        relatedProduct: [],
      }
    }

    const shopHeaders = buildHeaders({
      shopId: domainInfo.shop_id,
      userId: domainInfo.user_id,
    })

    const productData = productId
      ? await fetchAPI<any>(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCT.PRODUCT_DETAILS}/${productId}`,
          {
            headers: shopHeaders,
            cache: "force-cache",
            next: { revalidate: NEXT_REVALIDATE_TIME },
          }
        )
      : null

    const relatedProduct = productData?.data?.category_id
      ? (
          await fetchAPI<any[]>(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCT.CATEGORY_PRODUCTS}/${productData.data.category_id}?page=1`,
            {
              headers: shopHeaders,
              cache: "force-cache",
              next: { revalidate: NEXT_REVALIDATE_TIME },
            }
          )
        )?.data || []
      : []

    const orderPermision =
      (
        await fetchAPI<any>(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDER_PERMISION}`,
          {
            headers: shopHeaders,
            cache: "force-cache",
            next: { revalidate: NEXT_REVALIDATE_TIME },
          }
        )
      )?.data?.order_perm_status || null

    return {
      shopInfo: domainInfo,
      product: productData?.data || {},
      orderPermision,
      relatedProduct,
    }
  } catch (err) {
    console.error("[getProductDetailsData] Error:", err)
    return {
      shopInfo: {},
      product: {},
      orderPermision: null,
      relatedProduct: [],
    }
  }
}

/* =====================
   Landing Page
===================== */

export const getLandingPageData = async (shopId?: string, page?: string) => {
  if (!shopId || !page) {
    return { landingPageInfo: {} }
  }

  try {
    const data = await fetchAPI<any>(
      `${API_ENDPOINTS.BASE_URL}/page/${shopId}/${page}`,
      {
        next: { revalidate: 300 },
      }
    )

    return {
      landingPageInfo: data?.data || {},
    }
  } catch (err) {
    console.error("[getLandingPageData] Error:", err)
    return {
      landingPageInfo: {},
    }
  }
}

/* =====================
   Order Success Page
===================== */

export async function getDomainAndShopInfoOrderSuccess(host: string) {
  try {
    const domainInfo = await getDomainInfo(host)
    if (!domainInfo) return null

    return {
      domainInfo,
      domain_verify: domainInfo.domain_verify || "",
      domain: domainInfo.domain || "",
      shop_meta_title: domainInfo.shop_meta_title || "",
      shop_meta_description: domainInfo.shop_meta_description || "",
      shop_logo: domainInfo.shop_logo || "",
      theme_id: domainInfo.theme_id || "",
      fb_pixel: domainInfo.fb_pixel || "",
      shopId: domainInfo.shop_id || "",
    }
  } catch (err) {
    console.error("[getDomainAndShopInfoOrderSuccess] Error:", err)
    return null
  }
}
