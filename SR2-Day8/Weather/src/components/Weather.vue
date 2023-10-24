<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="mb-6">
      <label for="city" class="block text-sm font-medium text-gray-700"
        >City</label
      >
      <div class="mt-1">
        <input
          v-model="newCity"
          type="text"
          id="city"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter a city"
        />
      </div>
      <button
        @click="addCity"
        class="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add New City
      </button>
    </div>

    <div class="mb-6">
      <label for="weather" class="block text-sm font-medium text-gray-700"
        >Weather</label
      >
      <div class="mt-1 relative rounded-md shadow-sm">
        <select
          v-model="selectedCity"
          id="weather"
          name="weather"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option v-for="(city, index) in cities" :key="index" :value="city">
            {{ city }}
          </option>
        </select>
      </div>
      <router-link
        v-show="selectedCity !== ''"
        :to="'/weather-info/' + selectedCity"
        class="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Get Weather
      </router-link>
    </div>

    <div v-if="loading" class="p-4 mb-6 bg-blue-50 text-blue-800 rounded-lg">
      Loading...
    </div>

    <div v-if="error" class="p-4 mb-6 bg-red-50 text-red-800 rounded-lg">
      {{ error }}
    </div>

    <div v-if="weather.sys">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Weather in {{ weather.name }}, {{ weather.sys.country }}
          </h3>
          <div class="mt-5">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Coordinates</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  [{{ weather.coord.lat }}°, {{ weather.coord.lon }}°]
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Humidity</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ weather.main.humidity }}%
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Temperature</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ convertedTemperature(weather.main.temp) }}°C /
                  {{ weather.main.temp }} K
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Weather</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ weather.weather[0].main }} -
                  {{ weather.weather[0].description }}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Pressure</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ weather.main.pressure }} hPa
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Wind</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ weather.wind.speed }} m/s, {{ weather.wind.deg }}°
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";

const cities = ref([]);
const newCity = ref("");
const selectedCity = ref("");
const loading = ref(true);
const error = ref("");
const weather = ref({});
const apiKey = "7914d5a440960cfd5df3bd0388a7ad0f";

const addCity = () => {
  if (newCity.value && !cities.value.includes(newCity.value)) {
    cities.value.push(newCity.value);
    newCity.value = "";
  }
};

const convertedTemperature = (temp) => {
  return Math.round(temp - 273.15);
};

const geolocation = async (pos) => {
  const crd = pos.coords;

  await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${apiKey}`
    )
    .then(({ data }) => {
      weather.value = data;
      if (cities.value.length === 0) {
        cities.value.push(data.name);
      }
    })
    .catch(() => {
      error.value = "Weather data not found for this city.";
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  if (
    localStorage.getItem("cities") !== null &&
    localStorage.getItem("cities") !== ""
  ) {
    cities.value = JSON.parse(localStorage.getItem("cities"));
  }
  navigator.geolocation.getCurrentPosition(geolocation);
});

onUnmounted(() => {
  localStorage.setItem("cities", JSON.stringify(cities.value));
});
</script>
