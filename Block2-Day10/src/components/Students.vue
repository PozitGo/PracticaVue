<template>
  <div class="center" id="app">
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
              <button class="editButton" @click="cancelEditStudent(index)">
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
const updateStudent = ref({
  name: "",
  group: "",
  mark: "",
  isDonePr: false,
});
const currencies = ref(["UAH", "EUR", "USD"]);
const convertor = ref({
  amount: "",
  fromCurrency: "",
  toCurrency: "",
});
const converterCurrency = ref("");

const fetchStudents = () => {
  axios.get("http://34.82.81.113:3000/students").then((response) => {
    students.value = response.data.map((st) => ({
      ...st,
      isEdit: false,
    }));
    store.commit("setCount", students.value.length);
  });
};

const deleteStudent = (id) => {
  axios.delete(`http://34.82.81.113:3000/students/${id}`).then(() => {
    students.value = students.value.filter((st) => st._id !== id);
  });
};

const editStudent = (index) => {
  const { name, group, mark, isDonePr } = students.value[index];
  students.value[index].updateStudent = { name, group, mark, isDonePr };
  students.value[index].isEdit = true;
};

const cancelEditStudent = (index) => {
  students.value[index].isEdit = false;
};

const saveStudent = async (index, id) => {
  const { name, group, mark, isDonePr } = students.value[index].updateStudent;
  if (name && group && mark !== "") {
    try {
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
        updateStudent: {},
      };
    } catch (error) {
      console.error("Ошибка при сохранении студента:", error);
    }
  } else {
    console.error("Все поля должны быть заполнены");
  }
};

const createStudent = () => {
  axios
    .post("http://34.82.81.113:3000/students", newStudent.value)
    .then((response) => {
      students.value.push({ ...response.data, isEdit: false });
      newStudent.value.name = "";
      newStudent.value.group = "";
      newStudent.value.mark = "";
      newStudent.value.isDonePr = false;
    });
};

const convert = async ({ amount, fromCurrency, toCurrency }) => {
  if (amount !== "" && fromCurrency !== "" && toCurrency !== "") {
    if (fromCurrency === toCurrency) {
      converterCurrency.value = parseFloat(amount).toFixed(2);
    } else {
      try {
        const { data } = await axios.get(
          "https://api.monobank.ua/bank/currency"
        );
        if (data) {
          const fromCurrencyCode = cc.code(fromCurrency);
          const toCurrencyCode = cc.code(toCurrency);

          if (Number(toCurrencyCode.number) === 980) {
            const CurrencyRate = data.find(
              (rate) =>
                rate.currencyCodeA === Number(fromCurrencyCode.number) &&
                rate.currencyCodeB === Number(toCurrencyCode.number)
            );
            if (CurrencyRate) {
              converterCurrency.value = (amount * CurrencyRate.rateBuy).toFixed(
                2
              );
            } else {
              console.error("Не вдалося знайти курс валюти");
            }
          } else if (Number(fromCurrencyCode.number) === 980) {
            const CurrencyRate = data.find(
              (rate) =>
                rate.currencyCodeA === Number(toCurrencyCode.number) &&
                rate.currencyCodeB === 980
            );
            if (CurrencyRate) {
              converterCurrency.value = (
                amount / CurrencyRate.rateSell
              ).toFixed(2);
            } else {
              console.error("Не вдалося знайти курс валюти");
            }
          } else {
            const fromCurrencyRate = data.find(
              (rate) =>
                rate.currencyCodeA === Number(fromCurrencyCode.number) &&
                rate.currencyCodeB === 980
            );
            const toCurrencyRate = data.find(
              (rate) =>
                rate.currencyCodeA === Number(toCurrencyCode.number) &&
                rate.currencyCodeB === 980
            );
            if (fromCurrencyRate && toCurrencyRate) {
              converterCurrency.value = (
                (amount * fromCurrencyRate.rateBuy) /
                toCurrencyRate.rateSell
              ).toFixed(2);
            } else {
              console.error("Неможливо знайти курси валют");
            }
          }
        } else {
          console.error("Не вдалося отримати дані про валюту");
        }
      } catch (error) {
        console.error("Помилка при конвертації валюти:", error);
      }
    }
  }
};

onMounted(() => {
  fetchStudents();
});
</script>

<style scoped>
h3 {
  text-align: center;
}
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  color: #333;
}

.center {
  width: 80%;
  margin: 0 auto;
}

h1,
h2,
h3 {
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #333;
  color: #fff;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f5f5f5;
}

.red {
  color: red;
}

.black {
  color: black;
}

.delButton,
.editButton,
.submit-button {
  background-color: #333;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delButton:hover,
.editButton:hover,
.submit-button:hover {
  background-color: #555;
}

.student-form,
.currency-converter {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="checkbox"] {
  margin-right: 5px;
}

.currency-converter {
  max-width: 500px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.currency-converter label,
.currency-converter select,
.currency-converter input,
.currency-converter button {
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
}

.currency-converter label {
  font-weight: bold;
  margin-bottom: 5px;
}

.currency-converter input,
.currency-converter select,
.currency-converter button {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.currency-converter button {
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.currency-converter button:hover {
  background-color: #218838;
}

h4 {
  margin-top: 20px;
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
}
</style>
