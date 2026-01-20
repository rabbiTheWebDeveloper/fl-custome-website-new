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
  "/customer/categories": {
    GET: ApiResponse
  }
}
