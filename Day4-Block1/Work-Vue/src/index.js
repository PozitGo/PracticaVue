import { createApp, onMounted, ref } from "vue";
import axios from "axios";
const cc = require("currency-codes");

const app = createApp({
  setup() {
    const students = ref([]);
    const search = ref("");
    const newStudent = ref({
      name: "",
      group: "",
      mark: "",
      isDonePr: false,
    });
    const currencies = ref(["UAH", "EUR", "USD"]);
    const convertor = ref({
      amount: 0,
      fromCurrency: "UAH",
      toCurrency: "UAH",
    });
    const converterCurrency = ref("");

    const fetchStudents = async () => {
      try {
        const { data } = await axios.get("http://34.82.81.113:3000/students");
        students.value = data;
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    onMounted(fetchStudents);

    const deleteStudent = (index) => students.value.splice(index, 1);

    const createStudent = (studentData) => {
      students.value.push({ ...studentData });
      newStudent.value = {
        name: "",
        group: "",
        mark: "",
        isDonePr: false,
      };
    };

    const getRate = (data, currencyCodeA, currencyCodeB) => {
      return data.find(
        (rate) =>
          rate.currencyCodeA === currencyCodeA &&
          rate.currencyCodeB === currencyCodeB
      );
    };

    const convert = async ({ amount, fromCurrency, toCurrency }) => {
      if (amount !== "" && fromCurrency !== "" && toCurrency !== "") {
        if (fromCurrency === toCurrency) {
          converterCurrency.value = Number(amount.toFixed(2));
        } else {
          const { data } = await axios.get(
            "https://api.monobank.ua/bank/currency"
          );
          if (data) {
            const fromCurrencyNumber = Number(cc.code(fromCurrency).number);
            const toCurrencyNumber = Number(cc.code(toCurrency).number);

            if (toCurrencyNumber === 980) {
              const CurrencyRate = getRate(
                data,
                fromCurrencyNumber,
                toCurrencyNumber
              );
              converterCurrency.value = Number(
                (amount * CurrencyRate.rateBuy).toFixed(2)
              );
            } else if (fromCurrencyNumber === 980) {
              const CurrencyRate = getRate(data, toCurrencyNumber, 980);
              converterCurrency.value = Number(
                (amount / CurrencyRate.rateSell).toFixed(2)
              );
            } else {
              const fromCurrencyRate = getRate(data, fromCurrencyNumber, 980);
              const toCurrencyRate = getRate(data, toCurrencyNumber, 980);
              converterCurrency.value = Number(
                (
                  (amount * fromCurrencyRate.rateBuy) /
                  toCurrencyRate.rateSell
                ).toFixed(2)
              );
            }
          }
        }
      }
    };

    return {
      students,
      search,
      newStudent,
      currencies,
      convertor,
      converterCurrency,
      deleteStudent,
      createStudent,
      convert,
    };
  },
});

app.mount("#app");
