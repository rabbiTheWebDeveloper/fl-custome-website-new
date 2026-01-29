// Root API response
export interface ICategoriesApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  data: ICategory[]
}

// Category item
export interface ICategory {
  id: number
  wp_category_id: number | null
  name: string
  slug: string
  image: string | null
  wp_category_image_url: string | null
  description: string | null
  shop_id: number
  parent_id: number
  status: boolean
  sub_categories: ICategory[] // recursive for future nesting
}
