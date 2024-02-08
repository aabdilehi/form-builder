import { SessionData, createCookieSessionStorage } from '@remix-run/node'

type SessionFlashData = {
  error: string,
  message: string,
}

export const authSessionStorage = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: '_auth',
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { getSession, commitSession, destroySession } = authSessionStorage
