import type { User } from 'better-auth'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/server/auth'
import { Button } from './shadcn/button'

export async function UserAccount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <LoginButton />
  }

  return (
    <UserAvatar user={session.user} />
  )
}

export function LoginButton() {
  return (
    <Button className="mx-2" asChild>
      <Link href="/log-in">Log in</Link>
    </Button>
  )
}

export function UserAvatar({ user }: { user: User }) {
  return (
    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none hover:bg-fd-accent hover:text-fd-accent-foreground gap-1.5 p-1.5 max-lg:hidden">
      {/* TODO: add a fallback avatar */}
      <Image src={user.image ?? ''} alt={user.name ?? 'user'} className="rounded-full border" width={24} height={24} />
    </div>
  )
}
