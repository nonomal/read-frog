import type { Config } from '@/types/config/config'
import { defineExtensionMessaging } from '@webext-core/messaging'

interface ProtocolMap {
  openOptionsPage: () => void
  // config
  getInitialConfig: () => Config | null
  // translation state
  getEnablePageTranslation: (data: { tabId: number }) => boolean | undefined
  setEnablePageTranslation: (data: { tabId: number, enabled: boolean }) => void
  setEnablePageTranslationOnContentScript: (data: { enabled: boolean }) => void
  resetPageTranslationOnNavigation: (data: { url: string }) => void
  // read article
  readArticle: () => void
  popupRequestReadArticle: (data: { tabId: number }) => void
  // user guide
  pinStateChanged: (data: { isPinned: boolean }) => void
  getPinState: () => boolean
  returnPinState: (data: { isPinned: boolean }) => void
  // request
  enqueueRequest: (data: { type: string, params: Record<string, any>, scheduleAt: number, hash: string }) => Promise<any>
  // cache management
  cleanupTranslationCache: () => Promise<{ deletedCount: number, cutoffDate: Date }>
  getTranslationCacheStats: () => Promise<{ totalEntries: number, oldEntries: number, cleanupThreshold: Date }>
}

export const { sendMessage, onMessage }
  = defineExtensionMessaging<ProtocolMap>()
