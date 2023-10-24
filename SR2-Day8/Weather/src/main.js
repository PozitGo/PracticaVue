import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import Weather from './components/Weather.vue'
import WeatherInfo from './components/WeatherInfo.vue'
import './index.css'

const routes = [
  { path: '/', component: Weather },
  { path: '/weather-info/:city', component: WeatherInfo, props: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

createApp(App).use(router).mount('#app')
