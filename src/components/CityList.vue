<template>
  <div>
    <!-- Show skeletons while loading -->
    <template v-if="loading">
      <CityCardSkeleton v-for="n in savedCities.length || 1" :key="n" class="mb-4" />
    </template>

    <template v-else>
      <div v-for="city in savedCities" :key="city.id" class="mb-4">
        <CityCard :city="city" @click="goToCityView(city)" />
      </div>

      <p v-if="savedCities.length === 0">
        No locations added. To start tracking a location, search in the field above.
      </p>
    </template>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CityCard from './CityCard.vue'
import CityCardSkeleton from './CityCardSkeleton.vue'

const savedCities = ref([])
const loading = ref(false)
const router = useRouter()
const route = useRoute()

const getCities = async () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    loading.value = true // show skeletons

    const requests = savedCities.value.map((city) =>
      axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${city.coords.lat},${city.coords.lng}&days=1`,
      ),
    )

    const weatherData = await Promise.all(requests)
    await new Promise((res) => setTimeout(res, 1000))

    weatherData.forEach((value, index) => {
      savedCities.value[index].weather = value.data
    })

    loading.value = false // hide skeletons
  }
}

onMounted(getCities)

watch(
  () => route.name,
  (newRoute) => {
    if (newRoute === 'home') {
      getCities()
    }
  },
)

const goToCityView = (city) => {
  router.push({
    name: 'cityView',
    params: { state: city.state, city: city.city },
    query: {
      id: city.id,
      lat: city.coords.lat,
      lng: city.coords.lng,
    },
  })
}
</script>
