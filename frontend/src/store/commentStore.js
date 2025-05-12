import {makeAutoObservable, runInAction} from "mobx";
import apiClient from "../apiClient";
import ApiRoutes from "../urls.js";
import postStore from "./postStore.js";

class CommentStore {
  comments = new Map();
  activeCommentRequests = new Set();


  constructor() {
    makeAutoObservable(this);
  }

  async loadComments(postId) {
    if (this.comments.has(postId)) return;

    try {
      const response = await apiClient.get(`${ApiRoutes.COMMENT.GET}/${postId}`);
      runInAction(() => {
        this.comments.set(postId, response.data);
      });
    } catch (err) {
      console.error(`Ошибка загрузки комментариев для поста ${postId}:`, err);
    }
  }

  getComments(postId) {
    return this.comments.get(postId) || [];
  }

  async addComment(postId, text) {
    if (this.activeCommentRequests.has(postId)) {
      return; // уже обрабатывается
    }

    this.activeCommentRequests.add(postId);

    try {
      const response = await apiClient.post(`${ApiRoutes.COMMENT.CREATE}/${postId}`, {text});
      if (response.status === 201) {
        runInAction(() => {
          const current = this.getComments(postId);
          this.comments.set(postId, [...current, response.data]);

          // счётчик в посте
          const post = postStore.posts.find(p => p.id === postId);
          if (post) post.comment_count += 1;
        });
        return true;
      } else {
        alert("Не удалось сохранить комментарий");
        console.error(`Не удалось сохранить комментарий. Код ответа:`, response.status);
      }
    } catch (err) {
      alert("Ошибка при создании комментария");
      console.error(`Ошибка при добавлении комментария к посту ${postId}:`, err);
    } finally {
      this.activeCommentRequests.delete(postId);
    }
  }

  async deleteComment(postId, commentId) {
    try {
      await apiClient.delete(`${ApiRoutes.COMMENT.DELETE}/${commentId}`);
      runInAction(() => {
        const current = this.getComments(postId);
        const updated = current.filter(c => c.id !== commentId);
        this.comments.set(postId, updated);

        // счётчик в посте
        const post = postStore.posts.find(p => p.id === postId);
        if (post && post.comment_count > 0) post.comment_count -= 1;
      });
    } catch (err) {
      console.error(`Ошибка при удалении комментария ${commentId}:`, err);
    }
  }


  has(postId) {
    return this.comments.has(postId);
  }
}

const commentStore = new CommentStore();
export default commentStore;
