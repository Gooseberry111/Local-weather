<template>
  <div
    class="flex flex-col flex-1 items-center min-h-screen transition-all duration-700"
    :class="weatherBackground"
  >
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="text-white/80 p-3 bg-white/10 backdrop-blur w-full text-center text-sm"
    >
      <p>You are currently previewing this city, click the "+" icon to start tracking this city.</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-400 mt-8">
      <p>{{ error }}</p>
    </div>

    <template v-else-if="weatherData">
      <!-- Weather Overview -->
      <div class="flex flex-col items-center text-white py-8 px-4 w-full">
        <h1 class="text-3xl font-bold mb-1 tracking-wide">{{ route.params.city }}</h1>
        <p class="text-white/60 text-xs mb-6">
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

        <div
          class="flex flex-col items-center bg-white/10 backdrop-blur rounded-3xl px-16 py-8 mb-4 shadow-lg"
        >
          <p class="text-7xl font-thin mb-2">{{ Math.round(weatherData.current.temp_c) }}&deg;C</p>
          <img
            class="w-[80px] h-auto my-1"
            :src="`https:${weatherData.current.condition.icon}`"
            alt=""
          />
          <p class="capitalize text-white/90 text-sm font-medium">
            {{ weatherData.current.condition.text }}
          </p>
          <p class="text-white/60 text-xs mt-1">
            Feels like {{ Math.round(weatherData.current.feelslike_c) }}&deg;C
          </p>
        </div>
      </div>

      <!-- Hourly Weather -->
      <div class="max-w-screen-md w-full px-4 mb-6">
        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 shadow-md">
          <h2 class="text-white/70 text-xs uppercase tracking-widest mb-4">Hourly Forecast</h2>
          <div class="flex gap-6 overflow-x-scroll pb-2 scrollbar-hide">
            <div
              v-for="hourData in weatherData.hourly"
              :key="hourData.time_epoch"
              class="flex flex-col gap-2 items-center min-w-[50px]"
            >
              <p class="whitespace-nowrap text-xs text-white/70">
                {{
                  new Date(hourData.time_epoch * 1000).toLocaleTimeString('en-us', {
                    hour: 'numeric',
                  })
                }}
              </p>
              <img
                class="w-auto h-[35px] object-cover"
                :src="`https:${hourData.condition.icon}`"
                alt=""
              />
              <p class="text-sm text-white font-medium">{{ Math.round(hourData.temp_c) }}&deg;C</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Weather -->
      <div class="max-w-screen-md w-full px-4 mb-6">
        <div class="bg-white/10 backdrop-blur rounded-2xl p-4 shadow-md">
          <h2 class="text-white/70 text-xs uppercase tracking-widest mb-4">7 Day Forecast</h2>
          <div
            v-for="(day, index) in weatherData.forecast"
            :key="day.date_epoch"
            class="flex items-center py-2"
            :class="{ 'border-t border-white/10': index !== 0 }"
          >
            <p class="flex-1 text-sm text-white">
              {{
                new Date(day.date_epoch * 1000).toLocaleDateString('en-us', {
                  weekday: 'long',
                })
              }}
            </p>
            <img
              class="w-[35px] h-[35px] object-cover"
              :src="`https:${day.day.condition.icon}`"
              alt=""
            />
            <div class="flex gap-3 flex-1 justify-end text-sm">
              <p class="text-white font-medium">H: {{ Math.round(day.day.maxtemp_c) }}&deg;C</p>
              <p class="text-white/50">L: {{ Math.round(day.day.mintemp_c) }}&deg;C</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Remove City -->
      <div
        class="flex items-center gap-2 py-8 text-white/40 hover:text-red-400 cursor-pointer duration-150 text-sm"
        @click="removeCity"
      >
        <i class="fa-solid fa-trash text-xs"></i>
        <p>Remove City</p>
      </div>
    </template>

    <!-- Loading -->
    <div v-else class="text-white/60 mt-8 text-sm">Loading...</div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const weatherData = ref(null)
const error = ref(null)

// Dynamic background based on weather condition code
const weatherBackground = computed(() => {
  if (!weatherData.value) return 'bg-gradient-to-b from-weather-primary to-weather-secondary'

  const code = weatherData.value.current.condition.code
  const isDay = weatherData.value.current.is_day

  // Thunderstorm
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return 'bg-gradient-to-b from-gray-900 to-gray-700'
  }

  // Snow
  if ([1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
    return 'bg-gradient-to-b from-blue-100 to-blue-300'
  }

  // Rain / Drizzle
  if (
    [
      1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243,
      1246,
    ].includes(code)
  ) {
    return 'bg-gradient-to-b from-slate-700 to-slate-500'
  }

  // Foggy / Mist
  if ([1030, 1135, 1147].includes(code)) {
    return 'bg-gradient-to-b from-gray-500 to-gray-400'
  }

  // Cloudy / Overcast
  if ([1006, 1009].includes(code)) {
    return 'bg-gradient-to-b from-slate-600 to-slate-400'
  }

  // Partly Cloudy
  if (code === 1003) {
    return isDay
      ? 'bg-gradient-to-b from-blue-500 to-blue-300'
      : 'bg-gradient-to-b from-slate-800 to-slate-600'
  }

  // Clear / Sunny
  if (code === 1000) {
    return isDay
      ? 'bg-gradient-to-b from-amber-400 to-blue-400'
      : 'bg-gradient-to-b from-slate-900 to-blue-900'
  }

  // Default
  return 'bg-gradient-to-b from-weather-primary to-weather-secondary'
})

const getWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${route.query.lat},${route.query.lng}&days=7&aqi=no`,
    )

    const data = response.data
    data.currentTime = new Date(data.location.localtime).getTime()
    data.hourly = data.forecast.forecastday.flatMap((day) => day.hour)
    data.forecast = data.forecast.forecastday

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
