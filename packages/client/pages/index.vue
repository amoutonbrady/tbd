<template>
  <div class="container">
    <h1>Home</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import authMiddleware from '@/middleware/auth'

export default defineComponent({
  middleware: [authMiddleware],
  setup() {},
})
</script>
