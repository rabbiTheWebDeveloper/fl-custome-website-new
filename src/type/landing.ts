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
  shopId?: number | string | undefined
  other_script?: {
    gtm_head?: string
    gtm_body?: string
    google_analytics?: string
    [key: string]: string | undefined
  }
  // Social Media URLs
  fb?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string

  // Footer Styling
  footer_text_color?: string
  footer_link_color?: string
  footer_b_color?: string
  footer_heading_color?: string

  // Checkout Section Styling
  checkout_text_color?: string
  checkout_link_color?: string
  checkout_b_color?: string
  checkout_button_color?: string
  checkout_button_text_color?: string
}
