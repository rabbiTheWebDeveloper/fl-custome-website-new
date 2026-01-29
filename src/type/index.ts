export interface IProductsApiResponse {
  message: string
  success: boolean
  error_type: string
  execution_time: number
  data: IData
}

export interface IData {
  id: number
  category_id: number
  shop_id: number
}
