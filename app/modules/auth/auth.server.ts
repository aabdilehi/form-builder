import { PrismaClient, type user } from '@prisma/client'

import { Authenticator } from 'remix-auth'
import { TOTPStrategy } from 'remix-auth-totp'

import { authSessionStorage } from '~/modules/auth/auth-session.server'
import { sendAuthEmail } from '../email/email.server'
import { uuid } from 'uuidv4'

export let authenticator = new Authenticator<user>(authSessionStorage, {
  throwOnError: true,
})

/**
 * TOTP - Strategy.
 */
const prisma = new PrismaClient();
prisma.$connect();
authenticator.use(
  new TOTPStrategy(
    {
      secret: process.env.ENCRYPTION_SECRET,
      magicLinkGeneration: { callbackPath: '/magic-link' },

      createTOTP: async (data, expiresAt) => {
        await prisma.totp.create({ data: { ...data, expiresAt } })

        try {
          // Delete expired TOTP records (Optional).
          await prisma.totp.deleteMany({ where: { expiresAt: { lt: new Date() } } })
        } catch (error) {
          console.warn('Error deleting expired TOTP records', error)
        }
      },
      readTOTP: async (hash) => {
        // Get the TOTP data from the database.
        return await prisma.totp.findUnique({ where: { hash } })
      },
      updateTOTP: async (hash, data, expiresAt) => {
        // Update the TOTP data in the database.
        await prisma.totp.update({ where: { hash }, data })
      },
      sendTOTP: async ({ email, code, magicLink }) => {
        await sendAuthEmail({ email, code, magicLink })
      },
    },
    async ({ email }) => {
      let user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        user = await prisma.user.create({ data: { id: uuid(), email, username: email } })
        if (!user) throw new Error('Whoops! Unable to create user.')
      }

      return user
    },
  ),
)
