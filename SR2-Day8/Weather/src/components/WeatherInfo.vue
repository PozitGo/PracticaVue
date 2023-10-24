<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <div
      v-if="loading"
      class="bg-blue-100 p-4 rounded-lg text-blue-800 shadow-lg"
    >
      Loading...
    </div>
    <div v-else>
      <div
        v-if="error"
        class="bg-red-100 p-4 rounded-lg text-red-800 shadow-lg"
      >
        {{ error }}
      </div>
      <div v-else class="bg-white mt-4 rounded-lg shadow-lg overflow-hidden">
        <div class="bg-gray-800 p-4 text-white text-2xl">
          Weather in {{ weather.name }}, {{ weather.sys.country }}
        </div>
        <table class="min-w-full border-collapse">
          <tbody>
            <tr class="border-t">
              <td class="px-4 py-2 font-semibold">Coordinates</td>
              <td class="px-4 py-2">
                [{{ weather.coord.lat }}°, {{ weather.coord.lon }}°]
              </td>
            </tr>
            <tr class="bg-gray-50 border-t">
              <td class="px-4 py-2 font-semibold">Humidity</td>
              <td class="px-4 py-2">{{ weather.main.humidity }}%</td>
            </tr>
            <tr class="border-t">
              <td class="px-4 py-2 font-semibold">Temperature (AVG)</td>
              <td class="px-4 py-2">
                {{ convertedTemperature(weather.main.temp) }}°C ({{
                  weather.main.temp
                }}
                K)
              </td>
            </tr>
            <tr class="bg-gray-50 border-t">
              <td class="px-4 py-2 font-semibold">Condition</td>
              <td class="px-4 py-2">{{ weather.weather[0].main }}</td>
            </tr>
            <tr class="border-t">
              <td class="px-4 py-2 font-semibold">Pressure</td>
              <td class="px-4 py-2">{{ weather.main.pressure }} hPa</td>
            </tr>
            <tr class="bg-gray-50 border-t">
              <td class="px-4 py-2 font-semibold">Description</td>
              <td class="px-4 py-2">{{ weather.weather[0].description }}</td>
            </tr>
            <tr class="border-t">
              <td class="px-4 py-2 font-semibold">Wind Speed</td>
              <td class="px-4 py-2">{{ weather.wind.speed }} m/s</td>
            </tr>
            <tr class="bg-gray-50 border-t border-b">
              <td class="px-4 py-2 font-semibold">Wind Direction</td>
              <td class="px-4 py-2">{{ weather.wind.deg }}°</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, toRefs } from "vue";

const props = defineProps({
  city: String,
});
const { city } = toRefs(props);
const loading = ref(true);
const error = ref("");
const weather = ref({});
const apiKey = "7914d5a440960cfd5df3bd0388a7ad0f";

const convertedTemperature = (temp) => {
  return Math.round(temp - 273.15);
};

onMounted(async () => {
  await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}`
    )
    .then(({ data }) => {
      weather.value = data;
    })
    .catch(() => {
      error.value = "Weather data not found for this city.";
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
