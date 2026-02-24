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
  gtmHead?: string
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
  product: IProduct
}
export interface IProductAttributeValue {
  id: number
  attribute_id: number
  value: string
}

export interface IProductAttribute {
  id: string
  key: string
  values: IProductAttributeValue[]
}

export interface IProductCategory {
  id: number
  name?: string
  slug?: string
}

export interface IProduct {
  id: number
  category_id: number
  shop_id: number
  shop_uid: number
  product_name: string
  product_code: string
  product_qty: number
  slug: string
  price: number
  delivery_charge: "paid" | "free"
  inside_dhaka: number
  outside_dhaka: number
  discount: number
  discount_type: "flat" | "percentage"
  video_url: string | null
  packaging_cost: number | null
  transportation_cost: number | null
  ad_budget_cost: number | null
  buying_price: number | null
  short_description: string
  long_description: string
  status: number
  sub_area_charge: number
  default_delivery_location: string | null
  created_at: string
  updated_at: string
  product_type: string | null
  wp_product_id: number | null
  wp_product_image_url: string | null
  visit_counter: number
  main_image: string
  attributes: string | IProductAttribute[]
  category: IProductCategory | object
}
