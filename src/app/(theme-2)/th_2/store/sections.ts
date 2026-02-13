import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { ISectionItem } from "../types/sections"
import { createCookieStorage } from "./persistent-middwere"

export interface ISectionsState {
  sections: ISectionItem[] | null
}

export interface ISectionsActions {
  setSections: (data: ISectionItem[]) => void
  clearSections: () => void
}

export type SectionsStore = ISectionsState & ISectionsActions

export const defaultInitState: ISectionsState = {
  sections: null,
}

export const useSections = create<SectionsStore>()(
  persist(
    (set) => ({
      sections: null,
      setSections: (data) => set(() => ({ sections: data })),
      clearSections: () => set(() => ({ sections: null })),
    }),
    {
      name: "sections",
      storage: createJSONStorage(() =>
        createCookieStorage({
          sameSite: "strict",
        })
      ),
    }
  )
)
