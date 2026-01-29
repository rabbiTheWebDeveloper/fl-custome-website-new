import { create } from "zustand"
import { IShopResponse } from "@/app/(theme-2)/th_2/types/shop"
import { ICategoriesApiResponse, ICategory } from "../types/categories"

interface ICategories {
  categories: ICategory[] | null
  setCategories: (data: ICategoriesApiResponse) => void
}

export const useCategories = create<ICategories>((set) => ({
  categories: null,
  setCategories: (data) => set(() => ({ categories: data.data })),
}))
