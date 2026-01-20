"use client"

import { useState } from "react"
import { ShoppingCartIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CartItem } from "./cart-item"
import Link from "next/link"

// MOCK DATA and TYPE. SHOULD BE REMOVED LATER
interface CartProduct {
  id: string | number
  name: string
  size?: string
  price: number
  quantity: number
  image: string
  maxQuantity?: number
}

const initialCartProducts: CartProduct[] = [
  {
    id: 1,
    name: "Product Name",
    size: "L",
    price: 500,
    quantity: 1,
    image: "/product-placehoder.png",
    maxQuantity: 10,
  },
  {
    id: 2,
    name: "Another Product",
    size: "M",
    price: 750,
    quantity: 2,
    image: "/product-placehoder.png",
    maxQuantity: 5,
  },
]

const NO_ITEMS = 0

export const CartPopover = () => {
  const [cartProducts, setCartProducts] =
    useState<CartProduct[]>(initialCartProducts)

  const handleQuantityChange = async (
    productId: string | number,
    newQuantity: number
  ) => {
    setCartProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    )
  }

  const handleRemoveProduct = async (productId: string | number) => {
    setCartProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    )
  }

  const totalProducts = cartProducts.reduce(
    (sum, product) => sum + product.quantity,
    0
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="size-10.5 relative">
          <span className="sr-only">Cart</span>
          <ShoppingCartIcon className="size-6" />
          {totalProducts > NO_ITEMS && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full size-5 flex items-center justify-center">
              {totalProducts}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 md:w-[450px]">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 text-sm font-medium">
            <ShoppingCartIcon className="size-4" /> Cart ({totalProducts})
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {cartProducts.length > NO_ITEMS ? (
            <div className="flex flex-col divide-y">
              {cartProducts.map((product) => (
                <div key={product.id} className="p-4">
                  <CartItem
                    id={product.id}
                    name={product.name}
                    size={product.size}
                    price={product.price}
                    quantity={product.quantity}
                    image={product.image}
                    maxQuantity={product.maxQuantity}
                    onQuantityChange={(quantity) =>
                      handleQuantityChange(product.id, quantity)
                    }
                    onRemove={handleRemoveProduct}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Your cart is empty
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <Button className="w-full text-base" size="lg" asChild>
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
