// TODO: remove this once we have a proper way to get the client id and secret
/* eslint-disable node/prefer-global/process */
import type { BetterAuthOptions } from 'better-auth'
import { APP_NAME } from '@/lib/constants'

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  /**
   * The name of the application.
   */
  appName: APP_NAME,
  /**
   * Base path for Better Auth.
   * @default "/api/auth"
   */
  // basePath: "/api",

  /**
   * Enable email and password authentication
   */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // TODO: set to be true later
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      // TODO: typesafe way to get GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // .... More options
}
