import Dexie, { type EntityTable } from 'dexie'
import TranslationCache from './tables/translation-cache'

export default class AppDB extends Dexie {
  translationCache!: EntityTable<
    TranslationCache,
    'key'
  >

  constructor() {
    super('AppDB')
    this.version(1).stores({
      translationCache: `
        key,
        translation`,
    })
    this.translationCache.mapToClass(TranslationCache)
  }
}
