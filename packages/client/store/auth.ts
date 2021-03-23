import { defineStore } from 'pinia'
import { User } from '../../server/prisma'

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    token: '',
    user: undefined as User | undefined,
  }),
  getters: {
    isLoggedIn() {
      return !!this.token
    },
  },
  actions: {
    login(form: { email: string; password: string }) {
      return fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then((r) => r.json())
        .then<User & { token: string }>((user) => {
          this.token = user.token
          this.user = user

          return user
        })
    },

    logout() {
      this.token = ''
      this.user = undefined
    },
  },
})
