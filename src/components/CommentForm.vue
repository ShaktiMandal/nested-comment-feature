<template>
  <section>
    <input
      class="comment__post-input"
      type="text"
      placeholder="Enter comment here"
      :value="commentText"
      @input="onInput"
    />
    <input
      class="comment__post-btn"
      type="button"
      role="button"
      @click="onPost"
      value="Post"
    />
  </section>
</template>
<style>
.comment__post-input {
  height: 1.5rem;
  width: 20rem;
  padding: 0.2rem;
}
.comment__post-btn {
  width: 10rem;
  height: 2rem;
  border: none;
  outline: none;
  border-radius: 0.2rem;
  background: rgb(27, 27, 172);
  color: white;
}
.comment__post-btn:hover {
  cursor: pointer;
  background: rgb(16, 16, 212);
}
</style>
<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(['click', 'input'])

const onInput = (event) => {
  emit('input', event);
};
const onPost = () => {
  emit('onPost');
};
</script>