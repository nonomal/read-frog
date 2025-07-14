import { authClient } from '@/utils/auth/auth-client'

export function LoginInfo() {
  const { data, isPending, error } = authClient.useSession()
  if (isPending) {
    return <>Loading...</>
  }
  if (error) {
    return (
      <>
        Error:
        {error.message}
      </>
    )
  }
  if (data) {
    return (
      <>
        Signed in as
        {data.user.name}
      </>
    )
  }
}
