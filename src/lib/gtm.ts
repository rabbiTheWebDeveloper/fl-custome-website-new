interface GTMItem {
  item_id: string
  item_name: string
  price: number
  quantity: number
}

interface GTMUserData {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  city?: string
  country?: string
}

interface GTMEventModel {
  currency: string
  value: number
  items: GTMItem[]
  content_ids: string[]
  content_names: string[]
  first_name: string
  last_name: string
  email: string
  phone: string
  city: string
  country: string
  payment_method: string
  shipping_method: string
  client_user_agent: string
  client_ip_address: string
}

function getClientUserAgent(): string {
  if (typeof navigator !== "undefined") {
    return navigator.userAgent
  }
  return ""
}

let cachedIp: string | null = null

async function getClientIp(): Promise<string> {
  if (cachedIp) return cachedIp
  try {
    const res = await fetch("https://api.ipify.org?format=json")
    const data = await res.json()
    cachedIp = data.ip || ""
    return cachedIp!
  } catch {
    return ""
  }
}

function buildEventModel(
  items: GTMItem[],
  value: number,
  userData: GTMUserData = {},
  extra: {
    payment_method?: string
    shipping_method?: string
    client_ip_address?: string
  } = {}
): GTMEventModel {
  return {
    currency: "BDT",
    value,
    items,
    content_ids: items.map((i) => i.item_id),
    content_names: items.map((i) => i.item_name),
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    city: userData.city || "",
    country: userData.country || "",
    payment_method: extra.payment_method || "",
    shipping_method: extra.shipping_method || "",
    client_user_agent: getClientUserAgent(),
    client_ip_address: extra.client_ip_address || "",
  }
}

function pushToDataLayer(event: string, eventModel: GTMEventModel) {
  if (typeof window === "undefined") return
  const w = window as unknown as { dataLayer: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, eventModel })
}

export async function trackAddToCart(product: {
  id: string | number
  name: string
  price: number
  quantity: number
}) {
  const ip = await getClientIp()
  const items: GTMItem[] = [
    {
      item_id: String(product.id),
      item_name: product.name,
      price: product.price,
      quantity: product.quantity,
    },
  ]

  pushToDataLayer(
    "add_to_cart",
    buildEventModel(
      items,
      product.price * product.quantity,
      {},
      { client_ip_address: ip }
    )
  )
}

export async function trackBeginCheckout(
  cartItems: Array<{
    id: string | number
    name: string
    price: number
    quantity: number
  }>,
  totalValue: number,
  userData: GTMUserData = {},
  shippingMethod: string = ""
) {
  const ip = await getClientIp()
  const items: GTMItem[] = cartItems.map((item) => ({
    item_id: String(item.id),
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
  }))

  pushToDataLayer(
    "begin_checkout",
    buildEventModel(items, totalValue, userData, {
      shipping_method: shippingMethod,
      client_ip_address: ip,
    })
  )
}

export async function trackPurchase(
  cartItems: Array<{
    id: string | number
    name: string
    price: number
    quantity: number
  }>,
  totalValue: number,
  userData: GTMUserData = {},
  paymentMethod: string = "",
  shippingMethod: string = ""
) {
  const ip = await getClientIp()
  const items: GTMItem[] = cartItems.map((item) => ({
    item_id: String(item.id),
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
  }))

  pushToDataLayer(
    "purchase",
    buildEventModel(items, totalValue, userData, {
      payment_method: paymentMethod,
      shipping_method: shippingMethod,
      client_ip_address: ip,
    })
  )
}
