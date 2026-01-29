/**
 * Cart error types and error handling utilities
 */

/**
 * Base cart error class
 */
export class CartError extends Error {
  constructor(
    message: string,
    public code?: string,
    public cause?: unknown
  ) {
    super(message)
    this.name = "CartError"
    Object.setPrototypeOf(this, CartError.prototype)
  }
}

/**
 * Cart validation error
 * Thrown when cart input validation fails
 */
export class CartValidationError extends CartError {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message, "VALIDATION_ERROR")
    this.name = "CartValidationError"
    Object.setPrototypeOf(this, CartValidationError.prototype)
  }
}

/**
 * Cart storage error
 * Thrown when storage operations fail
 */
export class CartStorageError extends CartError {
  constructor(message: string, cause?: unknown) {
    super(message, "STORAGE_ERROR", cause)
    this.name = "CartStorageError"
    Object.setPrototypeOf(this, CartStorageError.prototype)
  }
}

/**
 * Cart API error
 * Thrown when API operations fail
 */
export class CartApiError extends CartError {
  constructor(
    message: string,
    public statusCode?: number,
    cause?: unknown
  ) {
    super(message, "API_ERROR", cause)
    this.name = "CartApiError"
    Object.setPrototypeOf(this, CartApiError.prototype)
  }
}

/**
 * Cart not found error
 * Thrown when cart item is not found
 */
export class CartItemNotFoundError extends CartError {
  constructor(itemId: string) {
    super(`Cart item with ID ${itemId} not found`, "ITEM_NOT_FOUND")
    this.name = "CartItemNotFoundError"
    Object.setPrototypeOf(this, CartItemNotFoundError.prototype)
  }
}

/**
 * Cart quantity error
 * Thrown when quantity exceeds maximum
 */
export class CartQuantityError extends CartError {
  constructor(
    message: string,
    public maxQuantity?: number,
    public requestedQuantity?: number
  ) {
    super(message, "QUANTITY_ERROR")
    this.name = "CartQuantityError"
    Object.setPrototypeOf(this, CartQuantityError.prototype)
  }
}

/**
 * Check if error is a cart error
 */
export function isCartError(error: unknown): error is CartError {
  return (
    error instanceof CartError ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      typeof error.name === "string" &&
      error.name.includes("Cart"))
  )
}

/**
 * Get user-friendly error message
 */
export function getCartErrorMessage(error: unknown): string {
  if (error instanceof CartError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred"
}

/**
 * Get error code from error
 */
export function getCartErrorCode(error: unknown): string | undefined {
  if (error instanceof CartError) {
    return error.code
  }

  return undefined
}
