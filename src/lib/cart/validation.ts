/**
 * Validation utilities for cart management
 * Ensures data integrity and security
 */

import type {
  CartItem,
  AddToCartOptions,
  UpdateCartItemOptions,
  CartItemVariant,
} from "./types"
import { CartValidationError } from "./errors"

/**
 * Sanitize and validate product ID
 */
export function validateProductId(
  productId: unknown
): productId is string | number {
  if (productId === null || productId === undefined) {
    throw new CartValidationError("Product ID is required", "productId")
  }

  if (typeof productId !== "string" && typeof productId !== "number") {
    throw new CartValidationError(
      "Product ID must be a string or number",
      "productId",
      productId
    )
  }

  if (typeof productId === "string" && productId.trim() === "") {
    throw new CartValidationError(
      "Product ID cannot be empty",
      "productId",
      productId
    )
  }

  if (
    typeof productId === "number" &&
    (isNaN(productId) || !isFinite(productId))
  ) {
    throw new CartValidationError(
      "Product ID must be a valid number",
      "productId",
      productId
    )
  }

  return true
}

/**
 * Sanitize and validate quantity
 */
export function validateQuantity(
  quantity: unknown,
  maxQuantity?: number
): quantity is number {
  if (quantity === null || quantity === undefined) {
    throw new CartValidationError("Quantity is required", "quantity")
  }

  const numQuantity =
    typeof quantity === "string" ? parseFloat(quantity) : quantity

  if (typeof numQuantity !== "number" || isNaN(numQuantity)) {
    throw new CartValidationError(
      "Quantity must be a valid number",
      "quantity",
      quantity
    )
  }

  if (!isFinite(numQuantity)) {
    throw new CartValidationError(
      "Quantity must be a finite number",
      "quantity",
      quantity
    )
  }

  if (numQuantity < 0) {
    throw new CartValidationError(
      "Quantity cannot be negative",
      "quantity",
      numQuantity
    )
  }

  if (!Number.isInteger(numQuantity)) {
    throw new CartValidationError(
      "Quantity must be an integer",
      "quantity",
      numQuantity
    )
  }

  if (maxQuantity !== undefined && numQuantity > maxQuantity) {
    throw new CartValidationError(
      `Quantity cannot exceed maximum of ${maxQuantity}`,
      "quantity",
      numQuantity
    )
  }

  return true
}

/**
 * Sanitize and validate price
 */
export function validatePrice(price: unknown): price is number {
  if (price === null || price === undefined) {
    throw new CartValidationError("Price is required", "price")
  }

  const numPrice = typeof price === "string" ? parseFloat(price) : price

  if (typeof numPrice !== "number" || isNaN(numPrice)) {
    throw new CartValidationError(
      "Price must be a valid number",
      "price",
      price
    )
  }

  if (!isFinite(numPrice)) {
    throw new CartValidationError(
      "Price must be a finite number",
      "price",
      numPrice
    )
  }

  if (numPrice < 0) {
    throw new CartValidationError("Price cannot be negative", "price", numPrice)
  }

  return true
}

/**
 * Sanitize and validate product name
 */
export function validateProductName(name: unknown): name is string {
  if (name === null || name === undefined) {
    throw new CartValidationError("Product name is required", "name")
  }

  if (typeof name !== "string") {
    throw new CartValidationError("Product name must be a string", "name", name)
  }

  const trimmed = name.trim()
  if (trimmed === "") {
    throw new CartValidationError("Product name cannot be empty", "name", name)
  }

  // Prevent XSS by checking for script tags
  if (/<script/i.test(trimmed)) {
    throw new CartValidationError(
      "Product name contains invalid characters",
      "name",
      name
    )
  }

  // Limit length to prevent abuse
  if (trimmed.length > 500) {
    throw new CartValidationError(
      "Product name is too long (max 500 characters)",
      "name",
      name
    )
  }

  return true
}

/**
 * Sanitize and validate variants
 */
export function validateVariants(
  variants: unknown
): variants is CartItemVariant[] {
  if (variants === null || variants === undefined) {
    return true // Variants are optional
  }

  if (!Array.isArray(variants)) {
    throw new CartValidationError(
      "Variants must be an array",
      "variants",
      variants
    )
  }

  for (const variant of variants) {
    if (typeof variant !== "object" || variant === null) {
      throw new CartValidationError(
        "Each variant must be an object",
        "variants",
        variant
      )
    }

    if (!variant.key || typeof variant.key !== "string") {
      throw new CartValidationError(
        "Variant key is required and must be a string",
        "variants",
        variant
      )
    }

    if (!variant.value || typeof variant.value !== "string") {
      throw new CartValidationError(
        "Variant value is required and must be a string",
        "variants",
        variant
      )
    }

    // Sanitize variant key and value
    if (variant.key.trim() === "") {
      throw new CartValidationError(
        "Variant key cannot be empty",
        "variants",
        variant
      )
    }

    if (variant.value.trim() === "") {
      throw new CartValidationError(
        "Variant value cannot be empty",
        "variants",
        variant
      )
    }

    // Prevent XSS
    if (/<script/i.test(variant.key) || /<script/i.test(variant.value)) {
      throw new CartValidationError(
        "Variant contains invalid characters",
        "variants",
        variant
      )
    }

    // Limit length
    if (variant.key.length > 100 || variant.value.length > 100) {
      throw new CartValidationError(
        "Variant key or value is too long (max 100 characters)",
        "variants",
        variant
      )
    }
  }

  return true
}

/**
 * Validate add to cart options
 */
export function validateAddToCartOptions(
  options: unknown
): options is AddToCartOptions {
  if (typeof options !== "object" || options === null) {
    throw new CartValidationError(
      "Add to cart options must be an object",
      "options",
      options
    )
  }

  const opts = options as AddToCartOptions

  validateProductId(opts.productId)
  validateProductName(opts.name)
  validatePrice(opts.price)

  if (opts.discountedPrice !== undefined) {
    validatePrice(opts.discountedPrice)
    if (opts.discountedPrice > opts.price) {
      throw new CartValidationError(
        "Discounted price cannot be greater than regular price",
        "discountedPrice",
        opts.discountedPrice
      )
    }
  }

  if (opts.quantity !== undefined) {
    validateQuantity(opts.quantity, opts.maxQuantity)
  }

  if (opts.variants !== undefined) {
    validateVariants(opts.variants)
  }

  return true
}

/**
 * Validate update cart item options
 */
export function validateUpdateCartItemOptions(
  options: unknown
): options is UpdateCartItemOptions {
  if (typeof options !== "object" || options === null) {
    throw new CartValidationError(
      "Update cart item options must be an object",
      "options",
      options
    )
  }

  const opts = options as UpdateCartItemOptions

  if (opts.itemId === undefined || typeof opts.itemId !== "string") {
    throw new CartValidationError(
      "Item ID is required and must be a string",
      "itemId",
      opts.itemId
    )
  }

  if (opts.quantity !== undefined) {
    validateQuantity(opts.quantity)
  }

  if (opts.price !== undefined) {
    validatePrice(opts.price)
  }

  if (opts.discountedPrice !== undefined) {
    validatePrice(opts.discountedPrice)
    if (opts.price !== undefined && opts.discountedPrice > opts.price) {
      throw new CartValidationError(
        "Discounted price cannot be greater than regular price",
        "discountedPrice",
        opts.discountedPrice
      )
    }
  }

  if (opts.variants !== undefined) {
    validateVariants(opts.variants)
  }

  return true
}

/**
 * Validate cart item
 */
export function validateCartItem(item: unknown): item is CartItem {
  if (typeof item !== "object" || item === null) {
    throw new CartValidationError("Cart item must be an object", "item", item)
  }

  const cartItem = item as CartItem

  if (!cartItem.id || typeof cartItem.id !== "string") {
    throw new CartValidationError(
      "Cart item ID is required and must be a string",
      "id",
      cartItem.id
    )
  }

  validateProductId(cartItem.productId)
  validateProductName(cartItem.name)
  validatePrice(cartItem.price)
  validateQuantity(cartItem.quantity, cartItem.metadata?.maxQuantity)

  if (cartItem.discountedPrice !== undefined) {
    validatePrice(cartItem.discountedPrice)
    if (cartItem.discountedPrice > cartItem.price) {
      throw new CartValidationError(
        "Discounted price cannot be greater than regular price",
        "discountedPrice",
        cartItem.discountedPrice
      )
    }
  }

  if (cartItem.variants !== undefined) {
    validateVariants(cartItem.variants)
  }

  return true
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim()
}

/**
 * Generate cart item ID from product and variants
 */
export function generateCartItemId(
  productId: string | number,
  variants?: CartItemVariant[]
): string {
  const baseId = String(productId)
  if (!variants || variants.length === 0) {
    return baseId
  }

  // Sort variants by key for consistent IDs
  const sortedVariants = [...variants].sort((a, b) =>
    a.key.localeCompare(b.key)
  )

  const variantHash = sortedVariants.map((v) => `${v.key}:${v.value}`).join("|")

  return `${baseId}:${variantHash}`
}
