<template>
  <div class="center" id="app">
    <p>Amount: {{ studentsCount }}</p>
    <button
      :class="
        store.state.selectedTheme === 'light' ? 'light-theme' : 'dark-theme'
      "
      @click="toggleTheme"
    >
      Змінити колір
    </button>
    <h1>Пошук</h1>
    <input type="text" name="search" v-model="search" />
    <table>
      <thead>
        <tr>
          <th>Ім'я</th>
          <th>Група</th>
          <th>Оцінка</th>
          <th>Здав</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(st, index) in students" :key="index">
          <template v-if="!st.isEdit"
            ><td>
              <router-link
                v-bind:to="'/student-info/' + st._id"
                :class="
                  st.name.includes(search) && search !== '' ? 'red' : 'black'
                "
              >
                {{ st.name }}
              </router-link>
            </td>
            <td>{{ st.group }}</td>
            <td>{{ st.mark }}</td>
            <td>
              <input type="checkbox" name="isDonePr" v-model="st.isDonePr" />
              {{ st.isDonePr }}
            </td>
            <td>
              <button class="delButton" @click="deleteStudent(st._id)">
                DELETE
              </button>
            </td>
            <td>
              <button class="editButton" @click="editStudent(index)">
                Редагувати
              </button>
            </td>
          </template>
          <template v-else>
            <td>
              <input type="text" v-model="st.updateStudent.name" />
            </td>
            <td>
              <select v-model="st.updateStudent.group">
                <option value="RPZ 20 1/9">RPZ 20 1/9</option>
                <option value="RPZ 20 2/9">RPZ 20 2/9</option>
              </select>
            </td>
            <td><input type="text" v-model="st.updateStudent.mark" /></td>
            <td>
              <input
                type="checkbox"
                name="isDonePr"
                v-model="st.updateStudent.isDonePr"
              />
              {{ st.updateStudent.isDonePr }}
            </td>
            <td>
              <button class="editButton" @click="saveStudent(index, st._id)">
                Зберегти
              </button>
            </td>
            <td>
              <button class="editButton" @click="canselEditStudents(index)">
                Скасувати
              </button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <h2>Додати учня</h2>
    <form @submit.prevent="createStudent()" class="student-form">
      <div class="form-group">
        <label for="name">Ім'я</label>
        <input
          type="text"
          id="name"
          name="name"
          v-model.trim="newStudent.name"
          required
        />
      </div>

      <div class="form-group">
        <label>Група</label>
        <select v-model="newStudent.group" required>
          <option value="RPZ 20 1/9">RPZ 20 1/9</option>
          <option value="RPZ 20 2/9">RPZ 20 2/9</option>
        </select>
      </div>

      <div class="form-group">
        <label for="mark">Оцінка</label>
        <input
          type="number"
          id="mark"
          name="mark"
          v-model="newStudent.mark"
          required
        />
      </div>

      <div class="form-group">
        <label for="isDonePr">Здав</label>
        <input
          type="checkbox"
          id="isDonePr"
          name="isDonePr"
          v-model="newStudent.isDonePr"
        />
      </div>

      <button type="submit" class="submit-button">Submit</button>
    </form>

    <h3>Конвертор</h3>
    <div class="currency-converter">
      <label for="amount">Amount:</label>
      <input type="number" name="amount" v-model="convertor.amount" />

      <label for="fromCurrency">From Currency:</label>
      <select name="fromCurrency" v-model="convertor.fromCurrency">
        <option v-for="(c, index) in currencies" :value="c" :key="index">
          {{ c }}
        </option>
      </select>

      <label for="toCurrency">To Currency:</label>
      <select name="toCurrency" v-model="convertor.toCurrency">
        <option v-for="(c, index) in currencies" :value="c" :key="index">
          {{ c }}
        </option>
      </select>

      <button @click="convert(convertor)">Convert</button>
      <h4>Converted Currency {{ converterCurrency }}</h4>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import cc from "currency-codes";

const store = useStore();
const students = ref([]);
const search = ref("");
const newStudent = ref({ name: "", group: "", mark: "", isDonePr: false });
const currencies = ref(["UAH", "EUR", "USD"]);
const convertor = ref({
  amount: "",
  fromCurrency: "",
  toCurrency: "",
});
const converterCurrency = ref("");

const fetchStudents = async () => {
  try {
    const response = await axios.get("http://34.82.81.113:3000/students");
    students.value = response.data.map((st) => ({
      ...st,
      isEdit: false,
      updateStudent: {
        name: st.name,
        group: st.group,
        mark: st.mark,
        isDonePr: st.isDonePr,
      },
    }));
    store.commit("setCount", students.value.length);
  } catch (error) {
    console.error("Error fetching students", error);
  }
};

const studentsCount = computed(() => store.getters.getCount);

const toggleTheme = () => {
  const newTheme = store.state.selectedTheme === "light" ? "dark" : "light";
  store.commit("setTheme", newTheme);
};

const deleteStudent = async (id) => {
  try {
    await axios.delete(`http://34.82.81.113:3000/students/${id}`);
    students.value = students.value.filter((st) => st._id !== id);
  } catch (error) {
    console.error("Error deleting student", error);
  }
};

const editStudent = (index) => {
  students.value[index].isEdit = true;
};

const cancelEditStudent = (index) => {
  students.value[index].isEdit = false;
};

const saveStudent = async (index, id) => {
  try {
    const { name, group, mark, isDonePr } = students.value[index].updateStudent;
    if (name && group && mark !== undefined && mark !== null) {
      const response = await axios.put(
        `http://34.82.81.113:3000/students/${id}`,
        {
          name,
          group,
          mark,
          isDonePr,
        }
      );
      students.value[index] = {
        ...response.data,
        isEdit: false,
        updateStudent: { name, group, mark, isDonePr },
      };
    }
  } catch (error) {
    console.error("Error saving student", error);
  }
};

const createStudent = async () => {
  try {
    const response = await axios.post(
      "http://34.82.81.113:3000/students",
      newStudent.value
    );
    students.value.push({
      ...response.data,
      isEdit: false,
      updateStudent: { ...newStudent.value },
    });
    newStudent.value = { name: "", group: "", mark: "", isDonePr: false };
  } catch (error) {
    console.error("Error creating student", error);
  }
};

const convert = async ({ amount, fromCurrency, toCurrency }) => {
  if (amount !== "" && fromCurrency !== "" && toCurrency !== "") {
    if (fromCurrency === toCurrency) {
      converterCurrency.value = amount;
    } else {
      try {
        const { data } = await axios.get(
          "https://api.monobank.ua/bank/currency"
        );
        const fromCurrencyCode = cc.code(fromCurrency);
        const toCurrencyCode = cc.code(toCurrency);
        // ваш код конвертации остается без изменений
      } catch (error) {
        console.error("Error converting currency", error);
      }
    }
  }
};

onMounted(fetchStudents);
</script>

<style scoped>
body {
  font-family: "Arial", sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.center {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

input[type="text"],
input[type="number"],
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

h1,
h2,
h3 {
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.submit-button {
  background-color: #4caf50;
  color: black;
}

.currency-converter label {
  margin-right: 10px;
}

.currency-converter button {
  margin-top: 10px;
}

.red {
  color: red;
}

.black {
  color: black;
}

.currency-converter {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.currency-converter label {
  display: inline-block;
  margin-right: 10px;
  font-weight: bold;
}

.currency-converter input,
.currency-converter select {
  margin-bottom: 10px;
  margin-right: 10px;
}

.currency-converter button {
  background-color: #28a745;
  color: #ffffff;
}

.currency-converter h4 {
  margin-top: 15px;
}

.light-theme .currency-converter {
  background-color: #ffffff;
}

.light-theme .currency-converter input,
.light-theme .currency-converter select {
  border: 1px solid #ccc;
}

.light-theme .currency-converter button {
  background-color: #4caf50;
}
.dark-theme .currency-converter {
  background-color: #424242;
  color: #ffffff;
}

.dark-theme .currency-converter input,
.dark-theme .currency-converter select {
  background-color: #555;
  color: #ffffff;
  border: 1px solid #777;
}

.dark-theme .currency-converter button {
  background-color: #28a745;
}

.light-theme {
  background-color: #f9f9f9;
  color: #333;
}

.light-theme button {
  background-color: #e7e7e7;
}

.light-theme input[type="text"],
.light-theme input[type="number"],
.light-theme select {
  background-color: white;
}

.light-theme table th {
  background-color: #f2f2f2;
}

.dark-theme {
  background-color: #333;
  color: #f9f9f9;
}

.dark-theme button {
  background-color: #555;
  color: #f9f9f9;
}

.dark-theme input[type="text"],
.dark-theme input[type="number"],
.dark-theme select {
  background-color: #555;
  color: #f9f9f9;
}

.dark-theme table th {
  background-color: #555;
}

.dark-theme table td {
  border-bottom: 1px solid #777;
}
</style>
