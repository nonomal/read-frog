import type { Browser } from '#imports'
import { atom, createStore } from 'jotai'

export const store = createStore()

export const isSideOpenAtom = atom(false)

export const isDraggingButtonAtom = atom(false)

export const progressAtom = atom({
  completed: 0,
  total: 0,
})

// Translation port atom for browser.runtime.connect
export const translationPortAtom = atom<Browser.runtime.Port | null>(null)
export const enablePageTranslationAtom = atom(false)

// export const explainAtom = atomWithMutation(() => ({
//   mutationKey: ["explainArticle"],
//   mutationFn: mutationFn,
// }));

export const readStateAtom = atom<
  'extracting' | 'analyzing' | 'continue?' | 'explaining' | undefined
>(undefined)
