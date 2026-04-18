import { create } from "zustand"
import { ISectionItem } from "../types/sections"

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

export const useSections = create<SectionsStore>((set) => ({
  sections: null,
  setSections: (data) => set(() => ({ sections: data })),
  clearSections: () => set(() => ({ sections: null })),
}))
