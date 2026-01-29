export interface IBannerApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  data: IBannerItem[]
}

export interface IBannerItem {
  id: number
  image: string
  link: string
  shop_id: string
  user_id: string
  created_at: string
  updated_at: string
  shop_uid: number
}
export interface IBannerQueries {
  duplicates: number
  time: number
  log: unknown[]
}
