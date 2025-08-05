// Test file to verify @repo/db browser-safe import in WXT
import { authSchema } from '@repo/db/browser'

export function testDbImport() {
  console.warn('Testing @repo/db/browser import in WXT extension')

  // Test that we can access the exported schemas (browser-safe)
  console.warn('authSchema:', typeof authSchema)

  return {
    authSchema,
    status: 'success',
  }
}
