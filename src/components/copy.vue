<template>
    <h1>Here we are going to design the component</h1>
    <div class="container">
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
    </div>
    <div class="messageContainer" v-if="messageList.length">
      <div
        class="msgDetails"
        v-for="(item, index) of messageList"
        :key="index.toString()"
      >
        <div class="commentArea">
          <div class="hearder">
            <span> {{ item.userId }}</span>
            <span>{{ item.postingDate }} {{ item.postingTime }}</span>
          </div>
          <div class="body">
            <span>{{ item.currentPostMessage }}</span>
          </div>
          <div class="footer">
            <input type="button" value="Delete" @click="onDelete(index)" />
            <input type="button" value="Edit" @click="onEdit(index)" />
            <input type="button" value="Reply" @click="onReply(item.userId)" />
          </div>
        </div>
        <div class="reply-container" v-if="isReplyDisplay(item.userId)">
          <input
            class="comment__post-input"
            type="text"
            placeholder="Enter reply here"
            @input="onReplyInput"
            :value="replyComment"
          />
          <input
            class="comment__post-btn"
            type="button"
            role="button"
            @click="onPost"
            value="Post"
          />
        </div>
        <div class="reply-container-message" v-if="isReplyDisplay(item.userId) && item.replies.length">
          <div
            class="reply-messages"
            v-for="msg of item.replies"
            :key="msg.userId"
          >
            <div class="commentArea">
              <div class="hearder">
                <span> {{ msg.userId }}</span>
                <span>{{ msg.postingDate }} {{ msg.postingTime }}</span>
              </div>
              <div class="body">
                <span>{{ msg.currentPostMessage }}</span>
              </div>
              <div class="footer">
                <input type="button" value="Delete" @click="onDelete(index)" />
                <input type="button" value="Edit" @click="onEdit(index)" />
                <input
                  type="button"
                  value="Reply"
                  @click="onReply(msg.userId)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, defineProps } from "vue";
  import { useAppStore } from "../appStore";
  
  // const props = defineProps({
  //   details:{
  //     type: Object
  //   }
  // })
  
  const { onPostComment, onEditComment, onDeleteComment } = useAppStore();
  let commentText = ref("");
  let replyComment = ref('')
  let messageList = ref([]);
  let isReply = ref(false);
  let selectedUserId = ref(-1);
  
  onMounted(() => {
    messageList.value = useAppStore().commentDetails;
  });
  const isReplyDisplay = (currentUserId) => {
    return isReply.value && selectedUserId.value === currentUserId;
  };
  const onInput = (event) => {
    if (event.target) {
      commentText.value = event.target.value;
    }
  };
  const onReplyInput = (event) => {
    if (event.target) {
      replyComment.value = event.target.value;
    }
  };
  
  const uniqueId = () => {
    return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
  };
  
  const onReply = (userId) => {
    if(selectedUserId.value === userId)
    {
      isReply.value = !isReply.value;
    }
    selectedUserId.value = userId;
  };
  
  const onEdit = (index) => {
    onEditComment(index);
  };
  const onDelete = (index) => {
    onDeleteComment(index);
  };
  const onPost = (event) => {
    event.preventDefault();
  
    const postDetails = {
      userId: uniqueId(),
      currentPostMessage: isReply.value ? replyComment.value : commentText.value,
      postingDate: Date.now(),
      postingTime: new Date().getTime(),
      replies: [],
      parentId: null,
    };
  
    if (selectedUserId.value != -1) {
      postDetails.parentId = selectedUserId.value;
    }
    commentText.value = "";
    replyComment.value = "";
    onPostComment(postDetails);
  };
  </script>
  
  <style>
  .msgDetails {
    margin-bottom: 1rem;
  }
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
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
  
  .comment__post-input {
    height: 1.5rem;
    width: 20rem;
    padding: 0.2rem;
  }
  .commentArea {
    height: 5rem;
    width: 31rem;
    border: 1px solid rgb(151, 125, 125);
    border-radius: 0.2rem;
  }
  .hearder {
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .messageContainer {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .footer {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: start;
    padding: 0.2rem;
    gap: 0.5rem;
  }
  .reply-container {
    display: flex;
    flex-direction: row;
    gap: 0.2rem;
    margin: 0.5rem 0 0 0.8rem;
  }
  
  .reply-container-message 
  {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin: 0.5rem 0 0 0.8rem;
  }
  </style>