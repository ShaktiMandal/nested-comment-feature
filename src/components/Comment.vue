<template>
  <div class="messageContainer">
    <div class="commentArea">
      <div class="hearder">
        <span>{{ details.createdBy }}</span>
        <span>{{ details.createdAt }} </span>
      </div>
      <div class="body">
        <span>{{ details.message }}</span>
      </div>
      <div class="footer">
        <input
          type="button"
          value="Delete"
          @click="onDelete(details.parentId, details.postId)"
        />
        <input
          type="button"
          value="Edit"
          @click="onEdit(details.parentId, details.postId)"
        />
        <input
          type="button"
          value="Reply"
          @click="onReply(details.parentId, details.postId)"
        />
      </div>
    </div>
    <div class="reply-list" v-if="showReplies">
      <div v-if="isEditing">
        <CommentForm @on-post="onEditPost" @input="onInput" />
      </div>
      <div v-if="isReplying">
        <CommentForm @on-post="onReplyPost" @input="onInput" />
      </div>
      <CommentList
        v-if="replies.length"
        :replies="replies"
        :parentId="details.parentId"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import { useAppStore } from "../appStore";
import CommentList from "./CommentList.vue";
import CommentForm from "./CommentForm.vue";

const { getComments, onEditComment, onDeleteComment, onPostComment } =
  useAppStore();
const isReplying = ref(false);
const isEditing = ref(false);
const isDeleting = ref(false);
const postMessage = ref("");
const replies = ref([]);
const selectedParentId = ref(null);
const selectedPostId = ref(null);
const props = defineProps({
  details: {
    type: Object,
  },
});

const showReplies = computed(()=> {
  return isReplying.value && (props.details.parentId == null ? true : selectedPostId.value === props.details.postId);
})
onMounted(() =>   replies.value = getComments(selectedPostId))

const uniqueId = () => {
  return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
};
const onInput = (event) => {
  postMessage.value = event.target.value;
};

const onReply = (parentId, postId) => {
  isReplying.value = !isReplying.value;
  isDeleting.value = false;
  isEditing.value = false;
  selectedPostId.value = postId;
  selectedParentId.value = parentId;
  replies.value = getComments(selectedPostId.value)
};

const onEdit = (parentId, postId) => {
  isEditing.value = true;
  isReplying.value = false;
  isDeleting.value = false;
  selectedPostId.value = postId;
  selectedParentId.value = parentId;
};

const onDelete = async (parentId, postId) => {
  isDeleting.value = true;
  isEditing.value = false;
  isReplying.value = false;
  selectedPostId.value = postId;
  selectedParentId.value = parentId;
  await onDeleteComment(postId);
  replies.value =
    selectedParentId.value == null
      ? getComments(selectedPostId.value)
      : getComments(selectedParentId.value);
};

const onEditPost = () => {
  isEditing.value = false;
  onEditComment(selectedPostId);
  replies.value =
    selectedParentId.value == null
      ? getComments(selectedPostId.value)
      : getComments(selectedParentId.value);
};

const onReplyPost = async () => {
  const postData = {
    postId: uniqueId(),
    message: postMessage.value,
    createAt: Date.now(),
    createdBy: Date.now(),
    replies: [],
    parentId: selectedPostId.value,
  };
  // parentId: selectedParentId == null ? selectedPostId : selectedParentId,
  onPostComment(postData).then( () => {
    replies.value = getComments(selectedPostId.value);
  
  });
  
    // selectedParentId == null
    //   ? getComments(selectedPostId)
    //   : getComments(selectedParentId);
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

.reply-container-message {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin: 0.5rem 0 0 0.8rem;
}

.reply-list {
  margin-left: 2rem;
}
</style>