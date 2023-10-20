<template>
  <div class="app-container">
    <h1 class="app-title">Пошук</h1>

    <div class="search-section">
      <input
        class="search-input"
        type="text"
        placeholder="Введіть ім'я..."
        v-model="query"
      />
    </div>
    <table class="students-table">
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
            ><td
              :class="st.name.includes(query) && query !== '' ? 'red' : 'black'"
            >
              {{ st.name }}
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

    <section class="add-student-section">
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
    </section>

    <section class="converter-section">
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
    </section>
  </div>
</template>

<script>
import axios from "axios";
import cc from "currency-codes";

export default {
  data() {
    return {
      students: [],
      query: "",
      newStudent: this.resetStudent(),
      updateStudent: this.resetStudent(),
      currencies: ["UAH", "EUR", "USD"],
      convertor: {
        amount: "",
        fromCurrency: "",
        toCurrency: "",
      },
      converterCurrency: "",
    };
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    resetStudent() {
      return { name: "", group: "", mark: "", isDonePr: false, isEdit: false };
    },
    async fetchStudents() {
      try {
        const { data } = await axios.get("http://34.82.81.113:3000/students");
        this.students = data.map((student) => ({ ...student, isEdit: false }));
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    },
    async performStudentAction(action, payload) {
      try {
        const url = `http://34.82.81.113:3000/students${
          payload.id ? `/${payload.id}` : ""
        }`;
        const { data } = await axios[action](url, payload.data);
        return data;
      } catch (error) {
        console.error(`Failed to ${action} student:`, error);
      }
    },
    async deleteStudent(id) {
      await this.performStudentAction("delete", { id });
      this.students = this.students.filter((st) => st._id !== id);
    },
    editStudent(index) {
      const student = this.students[index];
      this.students[index].updateStudent = { ...student };
      this.students[index].isEdit = true;
    },
    cancelEdit(index) {
      this.students[index].isEdit = false;
    },
    async saveStudent(index, id) {
      const updatedData = this.students[index].updateStudent;
      const updatedStudent = await this.performStudentAction("put", {
        id,
        data: updatedData,
      });
      if (updatedStudent) {
        this.students[index] = { ...updatedStudent, isEdit: false };
      }
    },
    async createStudent() {
      const newStudentData = await this.performStudentAction("post", {
        data: this.newStudent,
      });
      if (newStudentData) {
        this.students.push({ ...newStudentData, isEdit: false });
        this.newStudent = this.resetStudent();
      }
    },

    async convert({ amount, fromCurrency, toCurrency }) {
      if (!amount || !fromCurrency || !toCurrency) return;

      if (fromCurrency === toCurrency) {
        this.converterCurrency = amount;
      } else {
        const { data } = await axios.get(
          "https://api.monobank.ua/bank/currency"
        );
        if (data) {
          const fromCurrencyCode = cc.code(fromCurrency).number;
          const toCurrencyCode = cc.code(toCurrency).number;

          let conversionRate;

          if (Number(toCurrencyCode) === 980) {
            const rate = data.find(
              (r) =>
                r.currencyCodeA === Number(fromCurrencyCode) &&
                r.currencyCodeB === Number(toCurrencyCode)
            );
            conversionRate = rate.rateBuy;
          } else if (Number(fromCurrencyCode) === 980) {
            const rate = data.find(
              (r) =>
                r.currencyCodeA === Number(toCurrencyCode) &&
                r.currencyCodeB === 980
            );
            conversionRate = 1 / rate.rateSell;
          } else {
            const fromRate = data.find(
              (r) =>
                r.currencyCodeA === Number(fromCurrencyCode) &&
                r.currencyCodeB === 980
            );
            const toRate = data.find(
              (r) =>
                r.currencyCodeA === Number(toCurrencyCode) &&
                r.currencyCodeB === 980
            );
            conversionRate = fromRate.rateBuy / toRate.rateSell;
          }

          this.converterCurrency = (amount * conversionRate).toFixed(2);
        }
      }
    },
  },
};
</script>

<style scoped>
.app-container {
  font-family: "Arial", sans-serif;
  width: 90%;
  margin: 0 auto;
  max-width: 1200px;
}

.app-title {
  text-align: center;
  margin-top: 20px;
}

.search-section {
  margin: 20px 0;
}

.search-input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th,
.students-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.students-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.add-student-section,
.converter-section {
  margin-top: 40px;
}

button {
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

button:active {
  background-color: #2471a3;
}

button.editButton {
  background-color: #f39c12;
}

button.editButton:hover {
  background-color: #d68910;
}

button.delButton {
  background-color: #e74c3c;
}

button.delButton:hover {
  background-color: #c0392b;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.currency-converter {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  align-items: center;
}

h4 {
  margin-top: 15px;
}

.student-form .form-group {
  margin-bottom: 20px;
}

.submit-button {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.students-table .red {
  color: red;
}

.students-table .black {
  color: black;
}
</style>
