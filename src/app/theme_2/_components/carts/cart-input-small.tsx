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
}

const WARNING_TIMEOUT = 3000
const DEBOUNCE_TIMOUT = 500

export const CartInputSmall = ({
  value: defaultValue = 0,
  onChange,
  removeFromCart,
  className,
  productId,
  maxQuantity,
  inputOnly = false,
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
        setShowMaxWarning(true)
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current)
        }
        warningTimeoutRef.current = setTimeout(() => {
          setShowMaxWarning(false)
        }, WARNING_TIMEOUT)
        return
      }

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
    [defaultValue, debouncedUpdate, maxQuantity, inputOnly]
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
        <Alert variant="destructive" className="py-2">
          <AlertDescription>
            Maximum available quantity is {maxQuantity}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center focus-within:ring-2 ring-ring transition-shadow ring-0 ring-offset-0 focus-within:ring-offset-3 ring-offset-background rounded-xl border border-muted h-11">
        <Button
          variant="secondary"
          size="icon"
          className="bg-secondary cursor-pointer size-11 rounded-xl rounded-r-none"
          onClick={() => handleUpdate(localValue - 1)}
          disabled={localValue === 0 || isUpdating}
        >
          <span className="sr-only">Remove item</span>
          <MinusIcon className="size-6" />
        </Button>
        <div className="relative w-full text-center">
          <Input
            inputMode="numeric"
            max={maxQuantity}
            value={localValue}
            className={cn(
              "max-w-24 w-12 text-center shadow-none border-transparent! min-w-0 pr-0 pl-0 rounded-none h-11 bg-transparent!",
              isUpdating && "opacity-50",
              className?.input
            )}
            onChange={(e) => handleUpdate(e.target.value)}
            disabled={isUpdating}
          />
          {isUpdating && !inputOnly && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="w-4 h-4" />
            </div>
          )}
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="bg-secondary cursor-pointer size-11 rounded-xl rounded-l-none"
          onClick={() => handleUpdate(localValue + 1)}
          disabled={isUpdating || !!(maxQuantity && localValue >= maxQuantity)}
        >
          <span className="sr-only">Add item</span>
          <PlusIcon className="size-6" />
        </Button>
      </div>
    </div>
  )
}
