export interface IShopResponse {
  id: number
  name: string
  domain: string
  shop_id: number
  shop_address: string
  phone: string
  shop_meta_title: string
  shop_meta_description: string
  domain_verify: string
  fb_pixel: string | null
  c_api: string | null
  c_status: string
  test_event: string | null
  fb: string
  twitter: string
  linkedin: string
  instagram: string
  youtube: string
  default_delivery_location: string | null
  order_perm_status: number
  multipage_color: string | null
  order_otp_perm: number
  cname_verify: "failed" | "success"
  order_attach_img_perm: number
  pathao_location: number
  incompleted_order: number
  checkout_language_is_bangla: number
  whatsapp: string | null
  fb_page_id: string | null
  top_selling: number
  featured: number
  flash: number
  arrival: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gateways: any[]
  theme_id: string
  shop_logo: string
  shop_favicon: string
  addons_info: AddonsInfo[]
  other_script: OtherScript
}

export interface AddonsInfo {
  id: number
  shop_id: number
  shop_uid: number
  addons_id: number
  status: number
  created_at: string
  updated_at: string
}

export interface OtherScript {
  shop_id: number
  gtm_head: string | null
  gtm_body: string | null
  google_analytics: string | null
}
