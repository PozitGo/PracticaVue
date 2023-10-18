const { createApp, ref, computed } = Vue;
createApp({
  setup() {
    let age = ref("");
    let msg = ref("");
    let message = ref("");
    return { age, msg, message };
  },
}).mount("#app");
