import { IProduct } from "@/app/(theme-3-old)/th_3/types/product"

export interface LandingOrderProps {
  product: IProduct
  backgroundColor: string
  fontColor: string
  btnColor: string
  btnTextColor: string
  order_title?: string
  checkout_button_text?: string
  showShippingOptions?: boolean
  storeUrl?: string
}