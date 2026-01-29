import {
  ApiConfig,
  RequestContext,
  ApiResponse,
  DynamicHeaders,
  EndpointsWithMethod,
  ApiResponseData,
  ApiRequestBody,
} from "./api-types"

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface AuthConfig {
  tokenProvider?: () => Promise<string | null> | string | null
  tokenHeader?: string
  tokenPrefix?: string
}

class ApiClient {
  private config: Required<ApiConfig>
  private authConfig: AuthConfig

  constructor(config: ApiConfig = {}, authConfig: AuthConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || "",
      defaultHeaders: {
        // "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ipaddress: "103.102.15.162",
        browsername: "Google Chrome",
        ...config.defaultHeaders,
      },
      timeout: config.timeout || 10000,
    }

    this.authConfig = {
      tokenHeader: "Authorization",
      tokenPrefix: "Bearer",
      ...authConfig,
    }
  }

  private isFormData(body: unknown): body is FormData {
    return typeof FormData !== "undefined" && body instanceof FormData
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    context?: RequestContext
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint)
    const requestOptions = await this.buildRequestOptions(options, context)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout
      )

      const response = await fetch(url, {
        ...requestOptions,
        ...context?.fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let errorData: any = null

        try {
          errorData = await response.clone().json()
          errorMessage = errorData?.message ?? errorMessage
        } catch {
          try {
            errorMessage = await response.clone().text()
          } catch {}
        }

        // throw new ApiError(errorMessage, response.status, response)
      }

      const data = await this.parseResponse<T>(response)

      return {
        data,
        status: response.status,
        headers: response.headers,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new ApiError("Request timeout", 408)
      }
      throw error
    }
  }
  private async resolveDynamicHeaders(
    headers?: DynamicHeaders
  ): Promise<Record<string, string>> {
    if (!headers) return {}

    if (typeof headers === "function") {
      const result = headers()
      return result instanceof Promise ? await result : result
    }

    return headers
  }

  private buildUrl(endpoint: string): string {
    // Handle both absolute and relative URLs
    if (endpoint.startsWith("http")) {
      return endpoint
    }
    return `${this.config.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  }

  private async buildRequestOptions(
    options: RequestInit,
    context?: RequestContext
  ): Promise<RequestInit> {
    const headers: Record<string, string> = {
      ...this.config.defaultHeaders,
    }

    if (this.authConfig.tokenProvider) {
      const token = await this.authConfig.tokenProvider()
      if (token) {
        headers[this.authConfig.tokenHeader!] =
          `${this.authConfig.tokenPrefix} ${token}`
      }
    }
    const dynamicHeaders = await this.resolveDynamicHeaders(context?.headers)

    return {
      ...options,
      headers: {
        ...headers,
        ...dynamicHeaders,
        ...options.headers, // highest priority
      },
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      try {
        return await response.json()
      } catch (error) {
        throw new ApiError("Invalid JSON response", response.status, response)
      }
    }

    // Handle text responses
    return (await response.text()) as unknown as T
  }

  async get<T>(
    endpoint: string,
    options?: RequestInit,
    context?: RequestContext
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "GET" }, context)
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
    context?: RequestContext
  ): Promise<ApiResponse<T>> {
    const isForm = this.isFormData(data)
    return this.makeRequest<T>(
      endpoint,
      {
        ...options,
        method: "POST",
        body: isForm ? data : data ? JSON.stringify(data) : undefined,
        headers: {
          ...(options?.headers ?? {}),
          ...(isForm ? {} : { "Content-Type": "application/json" }),
        },
      },
      context
    )
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
    context?: RequestContext
  ): Promise<ApiResponse<T>> {
    const isForm = this.isFormData(data)

    return this.makeRequest<T>(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: isForm ? data : data ? JSON.stringify(data) : undefined,
        headers: {
          ...(options?.headers ?? {}),
          ...(isForm ? {} : { "Content-Type": "application/json" }),
        },
      },
      context
    )
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit,
    context?: RequestContext
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      { ...options, method: "DELETE" },
      context
    )
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
    context?: RequestContext
  ): Promise<ApiResponse<T>> {
    const isForm = this.isFormData(data)

    return this.makeRequest<T>(
      endpoint,
      {
        ...options,
        method: "PATCH",
        body: isForm ? data : data ? JSON.stringify(data) : undefined,
        headers: {
          ...(options?.headers ?? {}),
          ...(isForm ? {} : { "Content-Type": "application/json" }),
        },
      },
      context
    )
  }
}

export class TypedApiClient extends ApiClient {
  // -------- GET --------
  async getTyped<
    TEndpoint extends EndpointsWithMethod<"GET">,
    TResponse = ApiResponseData<TEndpoint, "GET">,
  >(endpoint: TEndpoint, context?: RequestContext): Promise<TResponse> {
    const response = await this.get<TResponse>(
      endpoint as string,
      undefined,
      context
    )
    return response.data
  }

  // -------- POST --------
  async postTyped<
    TEndpoint extends EndpointsWithMethod<"POST">,
    TResponse = ApiResponseData<TEndpoint, "POST">,
  >(
    endpoint: TEndpoint,
    body: ApiRequestBody<TEndpoint, "POST">,
    context?: RequestContext
  ): Promise<TResponse> {
    const response = await this.post<TResponse>(
      endpoint as string,
      body,
      undefined,
      context
    )
    return response.data
  }
  // -------- PUT --------
  async putTyped<
    TEndpoint extends EndpointsWithMethod<"PUT">,
    TResponse = ApiResponseData<TEndpoint, "PUT">,
  >(
    endpoint: TEndpoint,
    body: ApiRequestBody<TEndpoint, "PUT">,
    context?: RequestContext
  ): Promise<TResponse> {
    const response = await this.put<TResponse>(
      endpoint as string,
      body,
      undefined,
      context
    )
    return response.data
  }

  // -------- PATCH --------
  async patchTyped<
    TEndpoint extends EndpointsWithMethod<"PATCH">,
    TResponse = ApiResponseData<TEndpoint, "PATCH">,
  >(
    endpoint: TEndpoint,
    body: ApiRequestBody<TEndpoint, "PATCH">,
    context?: RequestContext
  ): Promise<TResponse> {
    const response = await this.patch<TResponse>(
      endpoint as string,
      body,
      undefined,
      context
    )
    return response.data
  }
  // -------- DELETE --------
  async deleteTyped<
    TEndpoint extends EndpointsWithMethod<"DELETE">,
    TResponse = ApiResponseData<TEndpoint, "DELETE">,
  >(endpoint: TEndpoint, context?: RequestContext): Promise<TResponse> {
    const response = await this.delete<TResponse>(
      endpoint as string,
      undefined,
      context
    )
    return response.data
  }
}
