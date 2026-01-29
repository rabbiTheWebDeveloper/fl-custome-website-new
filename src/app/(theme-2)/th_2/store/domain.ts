import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { IShopResponse } from "../types/shop"
import { createCookieStorage } from "./persistent-middwere"

export interface IDomainState {
  domain: IShopResponse | null
  domainAddress: string
}

export interface IDomainActions {
  setDomain: (data: IShopResponse) => void
  setDomainAddress: (address: string) => void
}
export type DomainStore = IDomainState & IDomainActions

export const defaultInitState: IDomainState = {
  domain: null,
  domainAddress: "",
}

export const useDomain = create<DomainStore>()(
  persist(
    (set) => ({
      domain: null,
      domainAddress: "",
      setDomain: (data) => set(() => ({ domain: data })),
      setDomainAddress(address) {
        return set(() => ({ domainAddress: address }))
      },
    }),
    {
      name: "domain",
      storage: createJSONStorage(() =>
        createCookieStorage({
          sameSite: "strict",
        })
      ),
    }
  )
)
