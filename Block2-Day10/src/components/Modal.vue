<template>
  <div class="vue-modal" v-show="open">
    <transition name="fade">
      <div class="vue-modal-inner" v-if="open">
        <div class="vue-modal-header">
          <h3>Студент</h3>
          <button type="button" @click="$emit('close')" class="close-btn">
            &times;
          </button>
        </div>
        <div class="vue-modal-body">
          <slot />
        </div>
        <div class="vue-modal-footer">
          <button type="button" @click="$emit('close')" class="btn">
            Закрыть
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.vue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.vue-modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  padding: 0 20px;
}

.vue-modal-inner {
  max-width: 600px;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.vue-modal-header,
.vue-modal-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vue-modal-header {
  justify-content: space-between;
  padding: 16px;
  background-color: #5b57d4;
  color: #fff;
  position: relative;
}

h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
}

.vue-modal-body {
  padding: 20px;
  max-width: 80%;
}

.vue-modal-footer {
  padding: 10px;
  text-align: right;
  border-top: 1px solid #eaeaea;
  width: 100%;
}

.btn {
  background-color: #5b57d4;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  align-self: flex-end;
  margin-top: 20px;
}

button:hover {
  opacity: 0.8;
}
</style>
