<template>
  <div class="post">
    <CommentForm @click="onPost" @input="onInput" />
    <CommentList />
  </div>
</template>
<style>
</style>
<script setup>
import { ref } from "vue";
import CommentList from "./CommentList.vue";
import CommentForm from "./CommentForm.vue";
import { useAppStore } from "../appStore";

const message = ref("");
const { onPostComment } = useAppStore();


const uniqueId = () => {
  return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
};

const onPost = () => {
  const postData = {
    postId: uniqueId(),
    message: message.value,
    createAt: Date.now(),
    createdBy: Date.now(),
    replies: [],
    parentId: null,
  };
  onPostComment(postData);
};

const onInput = (event) => {
  message.value = event.target.value;
};
</script>