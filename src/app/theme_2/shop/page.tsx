import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../_components/ui/select"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "../_components/ui/button"
import { Filters } from "../_components/shop/filters"
import { ProductList } from "../_components/shop/product-list"
import { FunnelIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../_components/ui/sheet"

export default function ShopPage() {
  return (
    <main>
      <div className="container py-16">
        <div className="flex items-center justify-between gap-3">
          <ul className="flex items-center gap-8 overflow-x-auto [&>li]:text-nowrap">
            <li className="text-xl md:text-3xl font-semibold">All Products</li>
            <li className="text-xl md:text-3xl font-semibold text-[#ACACAC]">
              <Link href="#">Men</Link>
            </li>
            <li className="text-xl md:text-3xl font-semibold text-[#ACACAC]">
              <Link href="#">Women</Link>
            </li>
            <li className="text-xl md:text-3xl font-semibold text-[#ACACAC]">
              <Link href="#">Kids</Link>
            </li>
            <li className="text-xl md:text-3xl font-semibold text-[#ACACAC]">
              <Link href="#"> Others</Link>
            </li>
          </ul>
          <div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary">
                    <FunnelIcon />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="flex flex-col gap-0 max-md:w-full max-h-[90svh] overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription className="sr-only">
                      Filter products
                    </SheetDescription>
                  </SheetHeader>
                  <div>
                    <Filters />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="max-md:hidden">
              <Select defaultValue="newest">
                <SelectTrigger
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "uppercase h-11! font-bold text-base gap-4 [&>svg]:w-6! [&>svg]:opacity-100! [&>svg]:text-foreground!"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="md:grid md:grid-cols-3 xl:grid-cols-5 mt-10 gap-10 items-start">
          <div className="max-md:hidden">
            <Filters />
          </div>
          <div className="md:col-span-2 xl:col-span-4 pb-10">
            <ProductList />
          </div>
        </div>
      </div>
    </main>
  )
}
