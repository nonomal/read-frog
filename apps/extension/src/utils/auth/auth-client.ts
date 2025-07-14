import { createAuthClient } from 'better-auth/react'
import { WEBSITE_DEV_URL, WEBSITE_PROD_URL } from '../constants/url'

export const authClient = createAuthClient({
  baseURL: import.meta.env.DEV ? WEBSITE_DEV_URL : WEBSITE_PROD_URL,
})
