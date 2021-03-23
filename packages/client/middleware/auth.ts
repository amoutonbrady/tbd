import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { User } from '../../server/prisma'
import { useAuth } from '../store/auth'

export default defineNuxtMiddleware(async (ctx) => {
  const authStore = useAuth()

  // @ts-ignore
  const token = ctx.$cookies.get('token')
  if (!token) return

  const user = await fetch('http://localhost:3000/auth/me', {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then<User>((r) => r.json())
    .catch(() => {
      // @ts-ignore
      ctx.$cookies.remove('token')
    })
  if (!user) return

  authStore.token = token
  authStore.user = user
})
