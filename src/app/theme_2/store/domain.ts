import { create } from "zustand"
import { IShopResponse } from "@/app/theme_2/types/shop"

interface Idomain {
  domain: IShopResponse | null
  setDomain: (data: IShopResponse) => void
}

export const useDomain = create<Idomain>((set) => ({
  domain: null,
  setDomain: (data) => set(() => ({ domain: data })),
}))
