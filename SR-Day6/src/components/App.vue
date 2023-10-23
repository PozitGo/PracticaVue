<template>
  <div id="app" class="container">
    <section class="Header-Text">
      <h1 class="title">Вибір Відділення</h1>
    </section>
    <div class="selects-container">
      <div class="select-wrapper">
        <label for="citySelect" class="select-label">Місто</label>
        <select id="citySelect" v-model="selectedCity" class="select-box">
          <option
            v-for="(city, index) in cities"
            :key="index"
            :value="city.description"
          >
            {{ city.description }}
          </option>
        </select>
      </div>
      <div class="select-wrapper">
        <label for="branchSelect" class="select-label">Відділення</label>
        <select id="branchSelect" v-model="selectedBranch" class="select-box">
          <option
            v-for="(branch, index) in branches"
            :key="index"
            :value="branch.description"
          >
            {{ branch.description }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
  setup() {
    const API_URL = "https://api.novaposhta.ua/v2.0/json/";
    const API_KEY = "d1375446269cfddaf5a89902d7a64beb";

    const cities = ref([]);
    const selectedCity = ref("");
    const branches = ref([]);
    const selectedBranch = ref("");

    const fetchData = async (modelName, calledMethod, properties) => {
      try {
        const { data } = await axios.post(API_URL, {
          apiKey: API_KEY,
          modelName,
          calledMethod,
          methodProperties: properties,
        });
        return data.data;
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
        return [];
      }
    };

    onMounted(async () => {
      const data = await fetchData("Address", "getCities", {});
      cities.value = data.map((city) => ({ description: city.Description }));
    });

    watch(selectedCity, async (newCity) => {
      if (newCity) {
        const data = await fetchData("AddressGeneral", "getWarehouses", {
          CityName: newCity,
        });
        branches.value = data.map((branch) => ({
          description: branch.Description,
        }));
      } else {
        branches.value = [];
      }
    });

    return {
      cities,
      selectedCity,
      branches,
      selectedBranch,
    };
  },
};
</script>

<style scoped>
.Header-Text {
  display: flex;
  flex-direction: column;
  text-align: center;
}
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.selects-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.select-wrapper {
  display: flex;
  flex-direction: column;
  width: 48%;
}

.select-label {
  font-size: 16px;
  margin-bottom: 5px;
  color: #555;
}

.select-box {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.select-box:focus {
  outline: none;
  border-color: #007bff;
}
</style>
