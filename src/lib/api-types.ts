export interface ApiResponse<T = unknown> {
  data: T
  status: number
  headers: Headers
}

export type FetchCache =
  | "default"
  | "no-store"
  | "reload"
  | "no-cache"
  | "force-cache"
  | "only-if-cached"

export interface NextFetchOptions {
  cache?: FetchCache
  next?: {
    tags?: string[]
    revalidate?: number
  }
}

export interface RequestContext {
  headers?: DynamicHeaders
  fetchOptions?: NextFetchOptions
}

export interface ApiConfig {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
  timeout?: number
  // domain?: string
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  headers: Headers
}

export type DynamicHeaders =
  | Record<string, string>
  | (() => Record<string, string>)
  | (() => Promise<Record<string, string>>)

export interface RequestContext {
  headers?: DynamicHeaders
}

export type ApiResponseData<
  T extends keyof ApiEndpoints,
  M extends keyof ApiEndpoints[T],
> = ApiEndpoints[T][M] extends { data: infer D } ? D : never

export type ApiRequestBody<
  T extends keyof ApiEndpoints,
  M extends keyof ApiEndpoints[T],
> = ApiEndpoints[T][M] extends { body: infer B } ? B : never

export type EndpointsWithMethod<M extends string> = {
  [K in keyof ApiEndpoints]: M extends keyof ApiEndpoints[K] ? K : never
}[keyof ApiEndpoints]

export interface ApiEndpoints {
  "/shops/domain": {
    GET: ApiResponse
  }
  "/shops/media/content?type=slider": {
    GET: ApiResponse
  }
  "/shops/content?type=about_us": {
    GET: ApiResponse
  }
  "/customer/categories": {
    GET: ApiResponse
  }
  "/customer/products": {
    GET: ApiResponse
  }
  "/customer/products/{id}": {
    GET: {
      params: {
        id: string | number
      }
      data: ApiResponse
    }
  }
  "/customer/category-product/list/{categoryId}": {
    GET: {
      params: {
        categoryId: string | number
      }
      data: ApiResponse
    }
  }
  "/customer/product-search?search=toy&page=1": {
    GET: ApiResponse
  }
  "/customer/order/store": {
    POST: {
      body: FormData | URLSearchParams
      data: ApiResponse
    }
  }
  "/customer/shipping-setting/show": {
    GET: ApiResponse
  }
  "/incomplete-order/status/{shopId}": {
    GET: {
      params: {
        shopId: string | number
      }
      data: ApiResponse<{
        success: boolean
        data: {
          shop_id: number
          incomplete_order_status: number
        }
      }>
    }
  }
  "/customer/incomplete-order": {
    POST: {
      body: {
        customer_name: string
        customer_phone: string
        customer_address: string
        order_type: string
        products: Array<{
          product_id: string | number
          variant_id: number
          qty: number
          subtotal: number
        }>
        grand_total: number
      }
      data: ApiResponse<{
        success: boolean
        data: {
          incomplete_order_id: number
        }
      }>
    }
  }
}
