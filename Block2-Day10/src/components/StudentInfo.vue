<template>
  <div>
    <div v-if="loading" class="loading-message">Loading...</div>
    <div v-if="error" class="error-message">Error loading data.</div>
    <div class="content" v-else>
      <p>Amount: {{ studentsCount }}</p>
      <div class="profile">
        <div v-if="student.photo" class="photo-container">
          <img
            @click="isOpen = true"
            :src="student.photo"
            :alt="student.name"
            class="photo"
          />
          <Modal :open="isOpen" @close="isOpen = !isOpen">
            <img :src="student.photo" :alt="student.name" />
          </Modal>
        </div>
        <h1 v-if="student.name" class="name">{{ student.name }}</h1>
      </div>
      <div class="info">
        <div v-if="student.group" class="info-item">
          Group: {{ student.group }}
        </div>
        <div v-if="student.isDonePr" class="info-item">
          Is Done PR: {{ student.isDonePr }}
        </div>
        <div v-if="student.mark" class="info-item">
          Mark: {{ student.mark }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, toRefs, computed } from "vue";
import { useStore } from "vuex";
import Modal from "./Modal.vue";

const store = useStore();
const props = defineProps({
  id: String,
});
const isOpen = ref(false);
const { id } = toRefs(props);
const student = ref({});
const loading = ref(true);
const error = ref(false);

const studentsCount = computed(() => {
  return store.getters.getCount;
});

onMounted(async () => {
  await axios
    .get(`http://34.82.81.113:3000/students/${id.value}`)
    .then(({ data }) => {
      student.value = data;
      loading.value = false;
    })
    .catch((err) => {
      console.error(err);
      error.value = true;
      loading.value = false;
    });
});
</script>

<style scoped>
body {
  background-color: #f4f2f7;
  font-family: Arial, sans-serif;
}

.loading-message,
.error-message {
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
  color: #fff;
  background-color: #8544d6;
  padding: 10px;
  border-radius: 5px;
}

.loading-message {
  background-color: #d3d3d3;
}

.error-message {
  background-color: #f44336;
}

.content {
  max-width: 600px;
  margin: 40px auto;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.photo-container {
  margin-right: 20px;
}

.photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #8544d6;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.photo:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.name {
  font-size: 24px;
  color: #8544d6;
  position: relative;
  display: inline-block;
}

.name::before {
  content: "students";
  font-size: 16px;
  color: #999;
  position: absolute;
  top: -24px;
  left: 0;
  letter-spacing: 1px;
}

.info {
  font-size: 18px;
}

.info-item {
  margin-bottom: 10px;
  color: #8544d6;
}

.info-item::before {
  content: "• ";
  color: #8544d6;
}
</style>
