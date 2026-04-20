export interface ISliderApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  data: ISliderItem[]
  queries: ISliderQueries
}

export interface ISliderItem {
  id: number
  image: string
  link: string
  shop_id: string
  shop_uid: number
  user_id: string
  created_at: string
  updated_at: string
}
export interface ISliderQueries {
  duplicates: number
  time: number
  log: unknown[]
}
