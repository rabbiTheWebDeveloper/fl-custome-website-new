export interface ISectionsApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  count: number
  data: ISectionItem[]
}

export interface ISectionItem {
  section: ISection
  products: ISectionProduct[]
  countdown?: {
    start: string
    end: string
  }
}

export interface ISection {
  id: number
  ulid: string
  shop_id: number
  name: string
  slug: string
  description: string | null
  meta_title: string | null
  meta_description: string | null
  section_type: string | null
  section_url: string | null
  section_image_url: string | null
  section_video_url: string | null
  has_countdown: boolean
  countdown_start: string | null
  countdown_end: string | null
  is_active: boolean
  order: number
  created_at: string
}

export interface ISectionWiseProductsApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  data: ISection & {
    products: ISectionProduct[]
  }
}

export interface ISectionProduct {
  id: number
  ulid: string
  shop_id: number
  product_name: string
  product_code: string
  slug: string
  price: number
  product_qty: number
  discount: number
  discount_type: string | null
  product_type: string | null
  video_url: string | null
  wp_product_image_url: string | null
  visit_counter: number
  status: number
  pivot?: {
    section_id: number
    product_id: number
    order: number
  }
  main_image: string | null
  tags: string[]
  // Additional fields that might be present
  discounted_price?: number
  flat_discount_percent?: number
}
