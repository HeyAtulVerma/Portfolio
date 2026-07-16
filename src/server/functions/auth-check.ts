import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { user } from '@/db/schema'
import { auth } from '@/lib/auth'
import { getRequest } from '@tanstack/react-start/server'

export const checkUsersExist = createServerFn({ method: 'GET' }).handler(async () => {
  const users = await db.select().from(user)
  return users.length > 0
})

export const requireAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session.user
})

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  return session
})
