<template>
  <div class="py-4 px-6 flex flex-col items-center">
    <router-link
      to="/"
      class="text-2xl font-bold text-gray-900 hover:text-purple-400 transition-colors font-poppins"
    >
      Weather
    </router-link>
    <router-view class="mt-4 w-full"></router-view>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>
