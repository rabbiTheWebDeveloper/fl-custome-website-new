"use client"

import * as React from "react"
import { MinusIcon } from "lucide-react"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "../ui/alert"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"

interface CartInputClassNames {
  root?: string
  input?: string
}

interface CartInputProps {
  /** The default/initial quantity value */
  value?: number
  /** Callback when quantity changes */
  onChange?: (quantity: number) => Promise<void> | void
  /** Callback to remove item from cart */
  removeFromCart?: (productId: string | number) => Promise<void> | void
  /** CSS class names for root and input elements */
  className?: CartInputClassNames
  /** Product ID for removing from cart */
  productId?: string | number
  /** Maximum allowed quantity */
  maxQuantity?: number
  /** If true, only allows input without API calls */
  inputOnly?: boolean
  onValuePreview?: (quantity: number) => void
}

const WARNING_TIMEOUT = 3000
const DEBOUNCE_TIMOUT = 500

export const CartInput = ({
  value: defaultValue = 0,
  onChange,
  removeFromCart,
  className,
  productId,
  maxQuantity,
  inputOnly = false,
  onValuePreview,
}: CartInputProps) => {
  const [localValue, setLocalValue] = React.useState<number>(defaultValue)
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)
  const [showMaxWarning, setShowMaxWarning] = React.useState<boolean>(false)
  const updateTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const pendingValueRef = React.useRef<number | null>(null)
  const warningTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  React.useEffect(() => {
    setLocalValue(defaultValue)
  }, [defaultValue])

  const debouncedUpdate = React.useCallback(async (): Promise<void> => {
    const valueToUpdate = pendingValueRef.current
    if (valueToUpdate === null || valueToUpdate === defaultValue) return

    if (!inputOnly) {
      setIsUpdating(true)
      try {
        if (valueToUpdate === 0) {
          if (productId !== undefined) {
            await removeFromCart?.(productId)
          }
        } else {
          await onChange?.(valueToUpdate)
        }
      } finally {
        setIsUpdating(false)
        pendingValueRef.current = null
      }
    } else {
      onChange?.(valueToUpdate)
      pendingValueRef.current = null
    }
  }, [defaultValue, onChange, removeFromCart, productId, inputOnly])

  const handleUpdate = React.useCallback(
    (newValue: string | number): void => {
      const numValue =
        typeof newValue === "string" ? parseInt(newValue, 10) || 0 : newValue
      setLocalValue(numValue)
      const validValue = Math.max(0, Number(newValue))

      if (maxQuantity && validValue > maxQuantity) {
        setLocalValue(maxQuantity)
        onValuePreview?.(maxQuantity)
        setShowMaxWarning(true)
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current)
        }
        warningTimeoutRef.current = setTimeout(() => {
          setShowMaxWarning(false)
        }, WARNING_TIMEOUT)
        return
      }
      onValuePreview?.(validValue)
      pendingValueRef.current = validValue

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      if (validValue === defaultValue) {
        pendingValueRef.current = null
        return
      }

      if (inputOnly) {
        debouncedUpdate()
      } else {
        updateTimeoutRef.current = setTimeout(debouncedUpdate, DEBOUNCE_TIMOUT)
      }
    },
    [defaultValue, debouncedUpdate, maxQuantity, inputOnly, onValuePreview]
  )

  React.useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={cn("flex flex-col gap-2", className?.root)}>
      {showMaxWarning && (
        <p className="text-xs text-red-500 font-bold px-1">
          Max: {maxQuantity} items
        </p>
      )}
      <div className="flex items-center h-11 bg-gray-50 dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:border-black dark:focus-within:border-white transition-colors">
        <button
          type="button"
          className="w-11 h-full flex items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => handleUpdate(localValue - 1)}
          disabled={localValue === 0 || isUpdating || maxQuantity === 0}
        >
          <span className="sr-only">Remove item</span>
          <MinusIcon className="w-4 h-4" />
        </button>

        <div className="relative flex-1 text-center min-w-0">
          <Input
            inputMode="numeric"
            max={maxQuantity}
            value={localValue}
            className={cn(
              "w-full text-center shadow-none border-none bg-transparent h-full text-sm font-black text-gray-900 dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none",
              isUpdating && "opacity-40",
              className?.input
            )}
            onChange={(e) => handleUpdate(e.target.value)}
            disabled={isUpdating || maxQuantity === 0}
          />
          {isUpdating && !inputOnly && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-zinc-900/80">
              <Spinner className="w-4 h-4" />
            </div>
          )}
        </div>

        <button
          type="button"
          className="w-11 h-full flex items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => handleUpdate(localValue + 1)}
          disabled={
            isUpdating ||
            maxQuantity === 0 ||
            !!(maxQuantity && localValue >= maxQuantity)
          }
        >
          <span className="sr-only">Add item</span>
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
