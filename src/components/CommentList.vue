<template>
    <div v-if="commentList && commentList.length">
        <div v-for="comment of commentList" :key="comment.messageId">
            <Comment :details="comment"/>
        </div>
    </div>
</template>
<style>
    
</style>
<script setup>
import { ref, defineProps } from 'vue';
import { onMounted } from '@vue/runtime-core';
import  Comment  from './Comment.vue';
import { useAppStore } from "../appStore";


const commentList = ref([]);
const props = defineProps({
    replies : {
        type: Array
    },
    isReplied : {
        type: Boolean,
        default: false
    },
    parentId : {
        type: Number,
        default: -1
    }
});

onMounted(()=> {
    commentList.value = props.replies && props.replies.length ? props.replies : useAppStore().commentDetails;
})
</script>
