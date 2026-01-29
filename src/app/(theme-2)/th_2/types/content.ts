export interface IContentApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  data: IContentItem[]
  queries?: unknown
}

export interface IContentItem {
  id: number
  shop_id: number
  shop_uid: number
  user_id: string
  type: string
  title?: string
  content?: string
  description?: string
  image?: string
  link?: string
  created_at: string
  updated_at: string
}
