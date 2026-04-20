/**
 * Shipping settings response from API
 */
export interface ShippingSetting {
  created_at: string
  id: number
  inside: string // Price as string
  outside: string // Price as string
  shop_id: number
  shop_uid: number
  status: number
  subarea: string // Price as string
  updated_at: string
  error_type: string
  execution_time: number
  message: string
}

/**
 * Shipping settings API response
 */
export interface ShippingSettingResponse {
  data: ShippingSetting | null | ""
  status: number
  headers: Headers
}
