import { sendGTMEvent } from "@next/third-parties/google"
import {
  extractArrayOfObject,
  extractProperties,
  extractPurchaseArrayOfObject,
  Product,
  PurchaseOrderItem,
} from "./google-analytics"

// ---- Types ---- //

type ItemType = "item_type_array" | "single_item"

interface CustomerDataInfo {
  order_no: string
  customer_name: string
  address: string
  phone: string
  value: number
}

interface GTMItem {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | object
    | unknown[]
}

// ---- Functions ---- //

export const tagManagerEvent = (
  eventName: string,
  value: number,
  items: unknown,
  itemType: ItemType
): void => {
  let dataItems: GTMItem[]

  if (itemType === "item_type_array") {
    dataItems = extractArrayOfObject(items as Product[]) as unknown as GTMItem[]
  } else {
    dataItems = [extractProperties(items as Product) as unknown as GTMItem]
  }

  sendGTMEvent({
    event: eventName,
    currency: "BDT",
    value,
    items: dataItems,
  })
}

export const purchaseTagManagerEventForPurchase = (
  eventName: string,
  customerDataInfo: CustomerDataInfo,
  items: unknown
): void => {
  const { order_no, customer_name, address, phone, value } = customerDataInfo

  sendGTMEvent({
    event: eventName,
    transaction_id: order_no,
    currency: "BDT",
    customerName: customer_name,
    customerShippingAddress: address,
    customerShippingPhone: phone,
    value,
    items: extractPurchaseArrayOfObject(
      items as { order_details?: PurchaseOrderItem[] }
    ) as unknown as GTMItem[],
  })
}
