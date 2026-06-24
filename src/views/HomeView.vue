<template>
  <main class="container text-white pt-8">
    <!-- Search Bar -->
    <div class="mb-8 relative">
      <div
        class="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 gap-3 focus-within:border-weather-accent duration-150"
      >
        <i class="fa-solid fa-magnifying-glass text-white/50"></i>
        <input
          type="text"
          v-model="searchQuery"
          @input="getSearchResults"
          placeholder="Search for a city or state..."
          class="bg-transparent w-full text-white placeholder-white/40 focus:outline-none text-sm"
        />
      </div>

      <!-- Search Results Dropdown -->
      <ul
        v-if="mapboxSearchResults"
        class="absolute bg-weather-secondary/95 backdrop-blur-md border border-white/10 rounded-2xl w-full shadow-xl py-2 mt-2 z-10"
      >
        <p class="py-2 px-4 text-sm text-white/60" v-if="searchError">
          Sorry, something went wrong. Please try again.
        </p>
        <p
          class="py-2 px-4 text-sm text-white/60"
          v-if="!searchError && mapboxSearchResults.length === 0"
        >
          No results match your query, try a different term.
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.name"
            class="py-3 px-4 text-sm cursor-pointer hover:bg-white/10 duration-150 flex items-center gap-3"
            @click="previewCity(searchResult)"
          >
            <i class="fa-solid fa-location-dot text-weather-accent text-xs"></i>
            {{ searchResult.name }}, {{ searchResult.region }}, {{ searchResult.country }}
          </li>
        </template>
      </ul>
    </div>

    <!-- City List -->
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import CityCardSkeleton from '../components/CityCardSkeleton.vue'
import CityList from '../components/CityList.vue'

const router = useRouter()

const previewCity = (searchResult) => {
  router.push({
    name: 'cityView',
    params: {
      state: searchResult.region,
      city: searchResult.name,
    },
    query: {
      lat: searchResult.lat,
      lng: searchResult.lon,
      preview: true,
    },
  })
}

const searchQuery = ref('')
const queryTimeout = ref(null)
const mapboxSearchResults = ref(null)
const searchError = ref(null)

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)

  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        const result = await axios.get(
          `https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${searchQuery.value}`,
        )

        mapboxSearchResults.value = result.data
      } catch {
        searchError.value = true
      }

      return
    }

    mapboxSearchResults.value = null
  }, 300)
}
</script>
