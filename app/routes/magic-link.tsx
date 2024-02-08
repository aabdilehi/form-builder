import type { DataFunctionArgs } from '@remix-run/node'
import { authenticator } from '~/modules/auth/auth.server'

export async function loader({ request }: DataFunctionArgs) {
  await authenticator.authenticate('TOTP', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })
}
