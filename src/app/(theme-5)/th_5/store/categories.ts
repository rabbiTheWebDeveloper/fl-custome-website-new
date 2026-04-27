import { create } from "zustand"
import { ICategoriesApiResponse, ICategory } from "../types/categories"

interface ICategories {
  categories: ICategory[] | null
  setCategories: (data: ICategoriesApiResponse) => void
}

export const useCategories = create<ICategories>((set) => ({
  categories: null,
  setCategories: (data) => set(() => ({ categories: data.data })),
}))
