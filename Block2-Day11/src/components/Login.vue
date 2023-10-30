<template>
  <div class="login-container">
    <h1>Авторизацiя</h1>
    <input
      v-model="input"
      type="text"
      placeholder="Ім'я студента"
      required
      class="input-field"
    />
    <button @click="login" class="login-button">Ввійти</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    login() {
      this.axios.get("http://34.82.81.113:3000/students").then((res) => {
        console.log("res.data :>> ", res.data);
      });
      this.axios
        .get("http://34.82.81.113:3000/students/name/" + this.input)
        .then((response) => {
          if (response.data === null || response.data.name == "CastError") {
            return;
          }
          this.$store.commit("setUser", response.data);
          this.$router.push("/");
        });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  border-radius: 20px;
  background-color: #1a1a1a;
  font-family: "Arial", sans-serif;
}

.input-field,
.login-button {
  width: 80%;
  padding: 15px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  width: 450px;
  transition: box-shadow 0.3s, transform 0.3s;
}

.input-field {
  background-color: #333;
  color: #fff;
}

.input-field::placeholder {
  color: #777;
}

.login-button {
  background-color: #fff;
  color: #333;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.login-button:hover {
  background-color: #f9f9f9;
  transform: translateY(-2px);
}

.login-button:active {
  background-color: #eee;
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.23);
}
</style>
