import Image from "next/image"
import { Button } from "../ui/button"
import { CartInput } from "./cart-input"
import { CartInputSmall } from "./cart-input-small"
import { TrashIcon } from "../ui/icons"

interface CartItemProps {
  id: string | number
  name: string
  size?: string
  price: number
  quantity: number
  image: string
  maxQuantity?: number
  onQuantityChange?: (quantity: number) => Promise<void> | void
  onRemove?: (productId: string | number) => Promise<void> | void
}

export const CartItem = ({
  id,
  name,
  size,
  price,
  quantity,
  image,
  maxQuantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
          {image && image.trim() !== "" && (
            <Image src={image} alt={name} fill className="object-cover" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-base leading-tight">{name}</h3>
              {size && (
                <p className="text-sm text-muted-foreground mt-1">
                  Sizes: {size}
                </p>
              )}
            </div>

            <div className="text-right font-semibold text-base shrink-0">
              ৳{price}
            </div>
          </div>

          <div className="flex items-center gap-3 justify-between max-md:hidden">
            <CartInputSmall
              value={quantity}
              onChange={onQuantityChange}
              removeFromCart={onRemove}
              productId={id}
              maxQuantity={maxQuantity}
              className={{
                root: "flex-1 max-w-40",
              }}
            />

            <Button
              variant="secondary"
              size="icon"
              className="size-11 shrink-0 rounded-xl"
              onClick={() => onRemove?.(id)}
            >
              <span className="sr-only">Remove item</span>
              <TrashIcon className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between md:hidden">
        <CartInput
          value={quantity}
          onChange={onQuantityChange}
          removeFromCart={onRemove}
          productId={id}
          maxQuantity={maxQuantity}
          className={{
            root: "flex-1 max-w-40",
          }}
        />

        <Button
          variant="outline"
          size="icon"
          className="size-13 shrink-0 rounded-xl"
          onClick={() => onRemove?.(id)}
        >
          <span className="sr-only">Remove item</span>
          <TrashIcon className="size-5" />
        </Button>
      </div>
    </div>
  )
}
