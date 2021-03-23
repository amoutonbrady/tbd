<template>
  <div>
    <header class="bg-true-gray-100 shadow">
      <nav class="container mx-auto py-4">
        <ul class="flex">
          <li>
            <nuxt-link to="/">Accueil</nuxt-link>
          </li>
          <li class="ml-auto">
            <nuxt-link v-if="authStore.isLoggedIn" to="">
              {{ authStore.user.email }}
            </nuxt-link>
          </li>
          <li>
            <button v-if="authStore.isLoggedIn" type="button" @click="logout">
              Se déconnecter
            </button>
          </li>
          <li v-if="!authStore.isLoggedIn">
            <nuxt-link to="/auth"> Log In </nuxt-link>
          </li>
          <li v-if="!authStore.isLoggedIn">
            <nuxt-link to="/auth/signin"> Sign In </nuxt-link>
          </li>
        </ul>
      </nav>
    </header>

    <input v-model="search" type="text" />

    <ul>
      <li v-for="city of suggestions" :key="city.id">
        <nuxt-link :to="`/cities/${city.id}`">
          {{ city.zip }} - {{ city.name }}
        </nuxt-link>
      </li>
    </ul>

    <Nuxt />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import { City } from '../../server/prisma'
import { useAuth } from '../store/auth'

// TODO: extract this
const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
) => {
  let timeout: any = 0
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      // eslint-disable-next-line node/no-callback-literal
      result = callback(...args)
    }, waitFor)
    return result
  }
}

export default defineComponent({
  setup() {
    const authStore = useAuth()
    const route = useRoute()
    const router = useRouter()
    const ctx = useContext()

    const search = ref('')
    const suggestions = ref<City[]>([])
    const fetcher = (value: string) =>
      fetch(`http://localhost:3000/cities?take=5&s=${value}`).then<City[]>(
        (r) => r.json()
      )

    const logout = () => {
      authStore.logout()
      // @ts-ignore
      ctx.$cookies.remove('token')
      router.push('/')
    }

    watch(route, () => {
      search.value = ''
    })

    watch(search, (value) => {
      if (!value) return (suggestions.value = [])
    })

    watch(
      search,
      debounce(async (value) => {
        if (!value) return
        suggestions.value = await fetcher(value)
      }, 300)
    )

    return { search, suggestions, authStore, logout }
  },
})
</script>
