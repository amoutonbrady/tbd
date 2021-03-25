<template>
  <div class="container mx-auto flex flex-col space-y-4">
    <h1
      v-if="!cityState.pending && city"
      class="text-center font-bold text-3xl"
    >
      {{ city.name }}
    </h1>

    <button v-if="ratings && !ratings.length" @click="load">
      Load ta mère
    </button>

    <!-- <form v-if="!categoriesState.pending && categories" class="border">
      <fieldset>
        <legend>Votre avis</legend>

        <label for="pros">
          <span>Avantage</span>
          <textarea />
        </label>
        <label for="cons">
          <span>Inconvénients</span>
          <textarea />
        </label>

        <div v-for="category of categories" :key="category.id">
          <label for="">
            <span>{{ category.name }}:</span>
            <select v-model="category.id">
              <option v-for="note of 10" :key="note" value="">
                {{ note }}
              </option>
            </select>
          </label>
        </div>
      </fieldset>
    </form> -->

    <ul v-if="!ratingsState.pending && ratings" class="flex flex-col space-y-4">
      <li
        v-for="rating of ratings"
        :key="rating.id"
        class="bg-white p-4 border rounded shadow flex flex-col space-y-2"
      >
        <ul v-if="categories && categories.length">
          <li v-for="category of rating.categories" :key="category.id">
            <strong>{{ category.name }}:</strong> {{ category.note }}/10
          </li>
        </ul>

        <p class="whitespace-pre-wrap">
          <strong>Les + :</strong> {{ rating.pros }}
        </p>
        <p class="whitespace-pre-wrap">
          <strong>Les - :</strong> {{ rating.cons }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import {
  City,
  Rating,
  RatingCategoriesOnRatings,
  RatingCategory,
} from '../../../server/prisma'
import { useAuth } from '../../store/auth'

type Ratings = (Rating & {
  categories: (RatingCategoriesOnRatings & RatingCategory)[]
})[]

export default defineComponent({
  setup() {
    const auth = useAuth()

    const route = useRoute()
    const city = ref<City>()
    const ratings = ref<Ratings>()
    const categories = ref<RatingCategory[]>()
    const notes = reactive<Record<string, string>>({})

    const { fetchState: cityState } = useFetch(async () => {
      city.value = await fetch(
        `http://localhost:3000/cities/${route.value.params.id}`
      ).then<City>((r) => r.json())
    })

    const { fetchState: ratingsState, fetch: refetchRatings } = useFetch(
      async () => {
        const cats = await fetch(`http://localhost:3000/categories`).then<
          RatingCategory[]
        >((r) => r.json())

        const cat = (id: number) => cats.find((c) => c.id === id)

        const ratings$ = await fetch(
          `http://localhost:3000/ratings?city=${route.value.params.id}`
        ).then<Ratings>((r) => r.json())

        ratings.value = ratings$.map((rating) => ({
          ...rating,
          categories: rating.categories.map((category) => ({
            ...category,
            ...cat(category.ratingCategoryId),
          })),
        }))

        categories.value = cats
      }
    )

    const { fetchState: categoriesState } = useFetch(async () => {
      const cats = await fetch(`http://localhost:3000/categories`).then<
        RatingCategory[]
      >((r) => r.json())

      categories.value = cats
    })

    const load = async () => {
      await fetch(
        `http://localhost:3000/ratings/load?city=${route.value.params.id}`,
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        }
      ).then((r) => r.json())

      refetchRatings()
    }

    return {
      city,
      load,
      ratings,
      categories,
      cityState,
      ratingsState,
      categoriesState,
      notes,
    }
  },
})
</script>
