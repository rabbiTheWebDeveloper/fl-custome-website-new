import { create } from "zustand"
import { IProduct } from "../types/product"

interface IproductStore {
  products: IProduct[] | null
  setProducts: (data: IProduct[]) => void
}

export const useProducts = create<IproductStore>((set) => ({
  products: null,
  setProducts: (data) => set(() => ({ products: data })),
}))
