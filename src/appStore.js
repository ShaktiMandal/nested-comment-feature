import { defineStore } from "pinia";

const initialAppStore = () => ({
  commentMsg: "",
  messageDetails: [],
  comments: [],
});

const getEveryLevelReply = (id, currentPosts) => {
 
  if (currentPosts.postId === id) return currentPosts;

  for(let reply of currentPosts.replies) {
    let matchedPost = getEveryLevelReply(id, reply);
    if(matchedPost) return matchedPost
  }
  return null;
}

const getReplies  = (postId, allPosts) => {
  for(let index = 0; index < allPosts.length; index++) {
    let matchedPost = getEveryLevelReply(postId, allPosts[index]);
    console.log("Matched post", matchedPost);
    if(matchedPost) return matchedPost.replies;
  }
  return [];
}

const AddNewReply = (postDetails, posts) => {

  const serachIndex = posts.findIndex(post => post.postId === postDetails.parentId);
  // If reply is in the first level
  if (serachIndex !== -1) {
    posts[serachIndex].replies.unshift({...postDetails});
    return;
  }
 
  // In case reply is not in first layer
  for(let index = 0; index < posts.length; index++) {
    let selectedPost = getEveryLevelReply(postDetails.parentId, posts[index]);
    if(selectedPost) {
      console.log("Adding selected post1", selectedPost.replies)
      selectedPost.replies.push({...postDetails});
      break;
    }
  }
} 

export const useAppStore = defineStore("app", {
  state: initialAppStore,
  getters: {
    postMessage: (state) => state.commentMsg,
    commentDetails: (state) => state.messageDetails,
    commentList: (state) => state.comments
  },
  actions: {
    async onPostComment(postDetails) {
      
        return new Promise((resolve, reject) => {
          if (!postDetails) {
            reject("No Data found");
            return;
          }

          const isNewPost = !this.messageDetails.length 
                            || (this.messageDetails.length && postDetails.parentId == null);

          if (isNewPost) {
            this.messageDetails.unshift({ ...postDetails});
          } else {
            AddNewReply(postDetails, this.messageDetails);
          }
          setTimeout(() => resolve(this.messageDetails));
          
        });
    },
    async onEditComment(index) {
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          if (index < 0) {
            reject("Invalid item selected");
            return;
          }
          this.messageDetails.splice(index, 1);
          resolve(this.messageDetails);
        });
      });
    },
    async onDeleteComment(index) {
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          if (index < 0) {
            reject("Invalid item selected");
            return;
          }
          this.messageDetails = this.messageDetails.filter(
            (currentIndex) => currentIndex !== index
          );
          resolve(this.messageDetails);
        });
      });
    },
    async onReplyComment(index) {
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          if (index < 0) {
            reject("Invalid item selected");
            return;
          }
          this.messageDetails = this.messageDetails.filter(
            (currentIndex) => currentIndex !== index
          );
          resolve(this.messageDetails);
        });
      });
    },
    getComments(postId = null) {
      if(postId == null) return [];
      return getReplies(postId, this.messageDetails);
    }
  },
});
