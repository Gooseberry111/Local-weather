<template>
  <header class="sticky top-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/10 shadow-md">
    <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-4">
      <!-- Logo / Home -->
      <RouterLink :to="{ name: 'home' }">
        <div class="flex items-center gap-3 group">
          <i
            class="fa-solid fa-sun text-weather-accent text-2xl group-hover:rotate-90 duration-300"
          ></i>
          <p class="text-xl font-semibold tracking-wide">The Local Weather</p>
        </div>
      </RouterLink>

      <!-- Actions -->
      <div class="flex gap-4 flex-1 justify-end items-center">
        <i
          class="fa-solid fa-circle-info text-lg text-white/70 hover:text-weather-accent duration-150 cursor-pointer"
          @click="toggleModal"
        ></i>

        <i
          v-if="route.query.preview"
          class="fa-solid fa-plus text-lg text-white/70 hover:text-weather-accent duration-150 cursor-pointer"
          @click="addCity"
        ></i>
      </div>

      <!-- Modal -->
      <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
        <div class="text-gray-800">
          <h1 class="text-xl font-semibold mb-2">About</h1>
          <p class="mb-4 text-sm text-gray-600">
            The Local Weather allows you to track the current and future weather of cities of your
            choosing.
          </p>

          <h2 class="text-lg font-semibold mb-2">How it works</h2>
          <ol class="list-decimal list-inside mb-4 text-sm text-gray-600 space-y-1">
            <li>Search for your city by entering the name into the search bar.</li>
            <li>Select a city within the results to view its current weather.</li>
            <li>Track the city by clicking the "+" icon in the top right.</li>
          </ol>

          <h2 class="text-lg font-semibold mb-2">Removing a city</h2>
          <p class="text-sm text-gray-600">
            Select the city from the home page and scroll to the bottom to find the remove option.
          </p>
        </div>
      </BaseModal>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BaseModal from './BaseModal.vue'
import { ref } from 'vue'
import { uid } from 'uid'

const savedCities = ref([])
const route = useRoute()
const router = useRouter()

const addCity = () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
  }

  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lng: route.query.lng,
    },
  }

  savedCities.value.push(locationObj)
  localStorage.setItem('savedCities', JSON.stringify(savedCities.value))

  let query = Object.assign({}, route.query)
  delete query.preview
  query.id = locationObj.id
  router.replace({ query })
}

const modalActive = ref(null)
const toggleModal = () => {
  modalActive.value = !modalActive.value
}
</script>
