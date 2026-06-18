<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
      <p>You are currently previewing this city, click the "+" icon to start tracking this city.</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-400 mt-8">
      <p>{{ error }}</p>
    </div>

    <template v-else-if="weatherData">
      <!-- Weather Overview -->
      <div class="flex flex-col items-center text-white py-10">
        <h1 class="text-3xl mb-2">{{ route.params.city }}</h1>
        <p class="text-sm mb-9">
          {{
            new Date(weatherData.currentTime).toLocaleDateString('en-us', {
              weekday: 'short',
              day: '2-digit',
              month: 'long',
            })
          }}
          {{
            new Date(weatherData.currentTime).toLocaleTimeString('en-us', {
              timeStyle: 'short',
            })
          }}
        </p>
        <p class="text-6xl mb-8">{{ Math.round(weatherData.current.temp_f) }}&deg;</p>
        <p>Feels like {{ Math.round(weatherData.current.feelslike_f) }} &deg;</p>
        <p class="capitalize">{{ weatherData.current.condition.text }}</p>
        <img class="w-[100px] h-auto" :src="`https:${weatherData.current.condition.icon}`" alt="" />
      </div>

      <hr class="border-white border-opacity-10 border w-full" />

      <!-- Hourly Weather -->
      <div class="max-w-screen-md w-full py-9">
        <div class="mx-8 text-white">
          <h2 class="mb-4">Hourly Weather</h2>
          <div class="flex gap-9 overflow-x-scroll">
            <div
              v-for="hourData in weatherData.hourly"
              :key="hourData.time_epoch"
              class="flex flex-col gap-4 items-center"
            >
              <p class="whitespace-nowrap text-sm">
                {{
                  new Date(hourData.time_epoch * 1000).toLocaleTimeString('en-us', {
                    hour: 'numeric',
                  })
                }}
              </p>
              <img
                class="w-auto h-[40px] object-cover"
                :src="`https:${hourData.condition.icon}`"
                alt=""
              />
              <p class="text-sm">{{ Math.round(hourData.temp_f) }}&deg;</p>
            </div>
          </div>
        </div>
      </div>

      <hr class="border-white border-opacity-10 border w-full" />

      <!-- Weekly Weather -->
      <div class="max-w-screen-md w-full py-5">
        <div class="mx-10 text-white">
          <h2 class="mb-5 items-center">7 Day Forecast</h2>
          <div v-for="day in weatherData.forecast" :key="day.date_epoch" class="flex items-center">
            <p class="flex-1">
              {{
                new Date(day.date_epoch * 1000).toLocaleDateString('en-us', {
                  weekday: 'long',
                })
              }}
            </p>
            <img
              class="w-[50px] h-[50px] object-cover"
              :src="`https:${day.day.condition.icon}`"
              alt=""
            />
            <div class="flex gap-2 flex-1 justify-end">
              <p class="text-sm">H: {{ Math.round(day.day.maxtemp_f) }}</p>
              <p class="text-sm">L: {{ Math.round(day.day.mintemp_f) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
        @click="removeCity"
      >
        <i class="fa-solid fa-trash"></i>
        <p>Remove City</p>
      </div>
    </template>

    <!-- Loading -->
    <div v-else class="text-white mt-8">Loading...</div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const weatherData = ref(null)
const error = ref(null)

const getWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${route.query.lat},${route.query.lng}&days=7&aqi=no`,
    )

    const data = response.data

    data.currentTime = new Date(data.location.localtime).getTime()
    data.hourly = data.forecast.forecastday.flatMap((day) => day.hour)
    data.forecast = data.forecast.forecastday

    // ← delay added here, just before data is shown
    await new Promise((res) => setTimeout(res, 1000))

    weatherData.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Could not load weather data. Please try again.'
  }
}

await getWeatherData()

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem('savedCities'))
  const updatedCities = cities.filter((city) => city.id !== route.query.id)
  localStorage.setItem('savedCities', JSON.stringify(updatedCities))
  router.push({ name: 'home' })
}
</script>
