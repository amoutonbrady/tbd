<template>
  <form @submit.prevent="login">
    <h1>Sign in</h1>

    <label for="email">
      <span>email:</span>
      <input v-model="form.email" name="email" type="email" />
    </label>

    <label for="password">
      <span>mot de passe:</span>
      <input v-model="form.password" name="password" type="password" />
    </label>

    <button type="submit">Se connecter</button>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'
import { useAuth } from '../../store/auth'

export default defineComponent({
  setup() {
    const router = useRouter()
    const authStore = useAuth()
    const ctx = useContext()

    const form = reactive({
      email: '',
      password: '',
    })

    async function login() {
      const user = await authStore.login(form)
      // @ts-ignore
      ctx.$cookies.set('token', user.token)
      router.push('/')
    }

    return { login, form }
  },
})
</script>
