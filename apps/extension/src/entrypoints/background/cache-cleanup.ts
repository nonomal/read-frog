import { db } from '@/utils/db/dexie/db'

const CACHE_CLEANUP_ALARM = 'cache-cleanup'
const CLEANUP_INTERVAL_MINUTES = 7 * 24 * 60
const CHECK_INTERVAL_MINUTES = 24 * 60

export function setupCacheCleanup() {
  // Set up periodic alarm for cache cleanup
  browser.alarms.create(CACHE_CLEANUP_ALARM, {
    delayInMinutes: 1,
    periodInMinutes: CHECK_INTERVAL_MINUTES,
  })

  // Listen for alarm events
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === CACHE_CLEANUP_ALARM) {
      await cleanupOldCache()
    }
  })

  // Handle manual cache cleanup requests
  onMessage('cleanupTranslationCache', async () => {
    return await cleanupOldCache()
  })

  // Handle cache stats request
  onMessage('getTranslationCacheStats', async () => {
    return await getCacheStats()
  })

  // Also run cleanup immediately when background script starts
  cleanupOldCache().catch((error) => {
    logger.error('Failed to run initial cache cleanup:', error)
  })
}

async function cleanupOldCache() {
  try {
    const cutoffDate = new Date()
    cutoffDate.setTime(cutoffDate.getTime() - CLEANUP_INTERVAL_MINUTES * 60 * 1000)

    // Delete all cache entries older than the cutoff date
    const deletedCount = await db.translationCache
      .where('createdAt')
      .below(cutoffDate)
      .delete()

    if (deletedCount > 0) {
      logger.info(`Cache cleanup: Deleted ${deletedCount} old translation cache entries`)
    }

    return { deletedCount, cutoffDate }
  }
  catch (error) {
    logger.error('Failed to cleanup old cache:', error)
    throw error
  }
}

async function getCacheStats() {
  try {
    const totalCount = await db.translationCache.count()
    const cutoffDate = new Date()
    cutoffDate.setTime(cutoffDate.getTime() - CLEANUP_INTERVAL_MINUTES * 60 * 1000)

    const oldCount = await db.translationCache
      .where('createdAt')
      .below(cutoffDate)
      .count()

    return {
      totalEntries: totalCount,
      oldEntries: oldCount,
      cleanupThreshold: cutoffDate,
    }
  }
  catch (error) {
    logger.error('Failed to get cache stats:', error)
    throw error
  }
}
