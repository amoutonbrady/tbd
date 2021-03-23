<template>
  <div class="container">
    <h1 v-if="!cityState.pending">{{ city.name }}</h1>

    <ul v-if="!ratingsState.pending">
      <li v-for="rating of ratings" :key="rating.id">
        {{ rating.id }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { City, Rating } from '../../../server/prisma'

export default defineComponent({
  setup() {
    const route = useRoute()
    const city = ref<City>()
    const ratings = ref<Rating[]>()

    const { fetchState: cityState } = useFetch(async () => {
      city.value = await fetch(
        `http://localhost:3000/cities/${route.value.params.id}`
      ).then<City>((r) => r.json())
    })

    const { fetchState: ratingsState } = useFetch(async () => {
      ratings.value = await fetch(
        `http://localhost:3000/ratings?city=${route.value.params.id}`
      ).then<Rating[]>((r) => r.json())
    })

    return { city, ratings, cityState, ratingsState }
  },
})
</script>
