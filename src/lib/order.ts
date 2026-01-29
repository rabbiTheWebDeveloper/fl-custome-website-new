/**
 * Order submission utilities
 * Prepares order data from cart and form data for API submission
 */

import type { CartItem } from "./cart/types"

/**
 * Order form data
 */
export interface OrderFormData {
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_note?: string
}

/**
 * Order submission data
 */
export interface OrderSubmissionData {
  formData: OrderFormData
  items: CartItem[]
  shippingMethod: "inside_dhaka" | "outside_dhaka"
  paymentMethod: "sslcommerz" | "cash-on-delivery" | "bkash"
  storeUrl: string
  visitorId?: string
  otpVerified?: number
  incomplete_order_id?: number
  /** Optional product data map for variant ID lookup */
  productDataMap?: Map<
    string | number,
    {
      attributes?: Array<{
        key: string
        values: Array<{ id: number; value: string; attribute_id: number }>
      }>
    }
  >
}

/**
 * Prepare order data for API submission
 * Converts cart items and form data to FormData format required by API
 */
export function prepareOrderData(data: OrderSubmissionData): FormData {
  const formData = new FormData()

  // Customer information
  formData.append("customer_name", data.formData.customer_name)
  formData.append("customer_phone", data.formData.customer_phone)
  formData.append("customer_address", data.formData.customer_address)

  // Customer note (optional)
  if (data.formData.customer_note) {
    formData.append("customer_note", data.formData.customer_note)
  }

  // Payment method (gateway)
  const gateway =
    data.paymentMethod === "cash-on-delivery" ? "cod" : data.paymentMethod
  formData.append("gateway", gateway)

  // Store URL - ensure it's in https:// format
  const storeUrl = data.storeUrl.startsWith("http")
    ? data.storeUrl
    : `https://${data.storeUrl}`
  formData.append("store_url", storeUrl)

  // Product arrays - map each cart item
  data.items.forEach((item) => {
    formData.append("product_id[]", String(item.productId))
    formData.append("product_qty[]", String(item.quantity))

    // Variant ID - get from item variants or lookup from product data
    let variantId = 0

    if (item.variants && item.variants.length > 0) {
      // First try to use stored attributeId
      if (item.variants[0]?.attributeId !== undefined) {
        variantId = Number(item.variants[0].attributeId)
      } else if (data.productDataMap) {
        // Try to lookup variant ID from product attributes
        const productData = data.productDataMap.get(item.productId)
        if (productData?.attributes) {
          const variant = item.variants[0]
          const attribute = productData.attributes.find(
            (attr) => attr.key === variant.key
          )
          if (attribute) {
            const value = attribute.values.find(
              (v) => v.value === variant.value
            )
            if (value) {
              variantId = value.id
            }
          }
        }
      }
    }

    formData.append("variant_id[]", String(variantId))
  })

  // Delivery location
  // Handle sub_area_charge case
  const deliveryLocation =
    data.shippingMethod === "outside_dhaka" ? "outside_dhaka" : "inside_dhaka"
  formData.append("delivery_location", deliveryLocation)

  // Visitor ID
  if (data.visitorId) {
    formData.append("visitor_id", data.visitorId)
  }

  // Order type - changed to "landing"
  formData.append("order_type", "website")

  // Incomplete order ID (if exists) - conditionally included
  if (
    data.incomplete_order_id !== null &&
    data.incomplete_order_id !== undefined
  ) {
    formData.append("incomplete_order_id", String(data.incomplete_order_id))
  }

  // Optional fields
  if (data.otpVerified !== undefined) {
    formData.append("otp_verified", String(data.otpVerified))
  }

  return formData
}

/**
 * Get store URL from domain cookie
 */
export function getStoreUrlFromCookie(): string {
  if (typeof window === "undefined") {
    return ""
  }

  try {
    const domainCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("domain="))

    if (domainCookie) {
      // Handle cookie value that might contain = signs
      const cookieValue = domainCookie.substring("domain=".length)

      // Try to decode the value
      let domainValue: string
      try {
        domainValue = decodeURIComponent(cookieValue)
      } catch {
        // If decode fails, use raw value
        domainValue = cookieValue
      }

      // Try to parse JSON
      let domain: unknown
      try {
        domain = JSON.parse(domainValue)
      } catch (parseError) {
        // If JSON parse fails, try to handle malformed JSON
        console.warn("Failed to parse domain cookie as JSON:", parseError)
        // Try to extract store_url from a potentially malformed JSON string
        const storeUrlMatch = domainValue.match(
          /store_url["\s]*:["\s]*"([^"]+)"/
        )
        if (storeUrlMatch) {
          return storeUrlMatch[1]
        }
        throw parseError
      }

      // Type guard for domain structure
      if (
        domain &&
        typeof domain === "object" &&
        "state" in domain &&
        domain.state &&
        typeof domain.state === "object" &&
        "domain" in domain.state &&
        domain.state.domain &&
        typeof domain.state.domain === "object" &&
        "store_url" in domain.state.domain
      ) {
        return String(domain.state.domain.store_url) || window.location.origin
      }

      return window.location.origin
    }
  } catch (error) {
    console.error("Error parsing domain cookie:", error)
  }

  // Fallback to current origin
  return typeof window !== "undefined" ? window.location.origin : ""
}
