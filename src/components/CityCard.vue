<template>
  <div class="flex py-4 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer">
    <div class="flex flex-col flex-1">
      <h2 class="text-2xl">{{ city.city }}</h2>
      <h3>{{ city.state }}</h3>
    </div>

    <div v-if="city.weather" class="flex flex-col gap-2">
      <p class="text-2xl self-end">{{ Math.round(city.weather.current.temp_c) }}&deg;C</p>
      <div class="flex gap-2">
        <span class="text-xs">
          H: {{ Math.round(city.weather.forecast.forecastday[0].day.maxtemp_c) }}&deg;C
        </span>
        <span class="text-xs">
          L: {{ Math.round(city.weather.forecast.forecastday[0].day.mintemp_c) }}&deg;C
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  city: {
    type: Object,
    default: () => {},
  },
})
</script>
