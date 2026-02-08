export interface IOrderSuccessfullApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  data: IOrderSuccessfullData
  queries: IQueryInfo
}

export interface IQueryInfo {
  duplicates: number
  time?: number
  log: unknown[]
}
export interface IOrderSuccessfullData {
  id: number
  shop_id: number
  shop_uid: number
  user_id: number
  order_no: string
  tracking_code: string
  online_payment_id: number | null
  customer_name: string
  phone: string
  address: string
  order_status: "pending" | "confirmed" | "delivered" | "cancelled"
  order_type: "website" | "manual"
  cod: number | null
  delivery_location: "inside_dhaka" | "outside_dhaka"
  created_at: string
  updated_at: string
  status_update_date: string | null
  cronjob_status: "y" | "n"
  courier_status: string | null
  visitor_id: string
  identify_otp: string
  otp_verified: number
  otp_sent: number
  deleted_at: string | null
  city: string | null
  zone: string | null
  area: string | null
  wp_order_id: number | null
  gateway: string | null
  invoice_printed: number
  order_details: IOrderDetail[]
  pricing: IOrderPricing
}
export interface IOrderPricing {
  id: number
  user_id: number
  shop_id: number
  order_id: number
  advanced: number
  due: number
  grand_total: number
  shipping_cost: number
  discount: number
  discount_type: "amount" | "percent"
}

export interface IOrderDetail {
  id: number
  user_id: number
  shop_id: number
  order_id: number
  product_id: number
  product_qty: number
  shipping_cost: number
  unit_price: number
  variant?: string | null
  variation?: unknown | null
  created_at: string
  updated_at: string
  product: IOrderSuccessfullData
}
