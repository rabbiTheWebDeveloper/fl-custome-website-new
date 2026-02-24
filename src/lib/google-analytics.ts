// ---- Types ---- //

export interface Product {
  id: string | number
  category_id?: string | number
  product_name: string
  product_code?: string
  product_qty: number
  discounted_price: number
  category?: string
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | object
    | unknown[]
}

export interface PurchaseOrderItem {
  product_id: string | number
  product_qty: number
  unit_price: number
  variant?: string
  product?: {
    product_name: string
    discount?: number
  }
}

interface ExtractedItem {
  item_id: string | number
  product_code?: string
  category_id?: string | number
  item_name: string
  item_category?: string
  price: number
  quantity: number
  discount?: number
  variant?: string
}

// ---- Functions ---- //

export function extractProperties(inputObject: Product): ExtractedItem {
  const {
    id,
    category_id,
    product_name,
    product_code,
    product_qty,
    discounted_price,
    category,
  } = inputObject

  return {
    item_id: id,
    product_code,
    category_id,
    item_name: product_name,
    item_category: category,
    price: discounted_price,
    quantity: product_qty,
  }
}

export const extractArrayOfObject = (
  originalArray: Product[]
): ExtractedItem[] => {
  return originalArray.map((item) => ({
    item_id: item.id,
    product_code: item.product_code,
    category_id: item.category_id,
    item_name: item.product_name,
    item_category: item.category,
    price: item.discounted_price,
    quantity: item.product_qty,
  }))
}

export const extractPurchaseArrayOfObject = (originalArray: {
  order_details?: PurchaseOrderItem[]
}): ExtractedItem[] => {
  return (
    originalArray?.order_details?.map((item) => ({
      item_id: item.product_id,
      item_name: item.product?.product_name || "",
      discount: item.product?.discount,
      variant: item.variant || "",
      price: item.unit_price,
      quantity: item.product_qty,
    })) || []
  )
}
