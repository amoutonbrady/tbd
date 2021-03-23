<template>
  <form @submit.prevent="signup">
    <h1>Sign up</h1>

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
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const router = useRouter()

    const form = reactive({
      email: '',
      password: '',
    })

    function signup() {
      fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then((r) => r.json())
        .then(() => router.push('/auth'))
    }

    return { signup, form }
  },
})
</script>
