export interface IProductsApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  current_page: number
  data: IProduct[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: IPaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface IProduct {
  id: number
  category_id: number
  shop_id: number
  wp_product_id: number
  product_name: string
  product_code: string
  product_qty: number
  slug: string
  price: number
  discount: number
  discounted_price: number
  discount_type: string | null
  flat_discount_percent: number
  delivery_charge: string
  inside_dhaka: number
  outside_dhaka: number
  status: number
  sub_area_charge: number
  default_delivery_location: string | null
  attributes: boolean
  variation_price_range: number[]
  variations: boolean | []
  created_at: string // ISO date string
  main_image: string | null
  wp_product_image_url: string | null
  short_description: string | null
  long_description: string | null
  relatedProducts?: IProduct[]
  other_images: string[]
}

export interface IPaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}
