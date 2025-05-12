import {makeAutoObservable, runInAction} from "mobx";
import apiClient from "../apiClient";
import ApiRoutes from "../urls.js";

class PostStore {
  posts = [];
  isCreatingPost = false;
  activeLikeRequests = new Set();


  constructor() {
    makeAutoObservable(this);
  }

  async loadPosts() {
    try {
      const response = await apiClient.get(ApiRoutes.POST.GET);
      runInAction(() => {
        this.posts = response.data;
      });
    } catch (err) {
      if (err.code === "TOKEN_EXPIRED") {
        return
      } else {
        console.error("Ошибка при загрузке постов:", err);
      }
    }
  }

  async deletePost(postId) {
    try {
      await apiClient.delete(`${ApiRoutes.POST.DELETE}/${postId}`);
      runInAction(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
      });
    } catch (err) {
      console.error(`Ошибка при удалении поста ${postId}:`, err);
    }
  }


  async createPost(text) {
    if (this.isCreatingPost) return false;

    this.isCreatingPost = true;
    try {
      const response = await apiClient.post(ApiRoutes.POST.CREATE, {text});
      if (response.status === 201) {
        runInAction(() => {
          this.posts.unshift(response.data);
        });
        return true;
      } else {
        console.error(`Не удалось сохранить пост. Код ответа:`, response.status);
      }
    } catch (err) {
      alert("Ошибка при создании поста");
      console.error("Ошибка при создании поста", err);
      return false;
    } finally {
      this.isCreatingPost = false;
    }
  }


  toggleLike(postId) {
    if (this.activeLikeRequests.has(postId)) {
      return; // уже обрабатывается
    }

    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const prev = post.liked_by_me;
    const delta = prev ? -1 : 1;

    post.liked_by_me = !prev;
    post.likes_count += delta;

    this.activeLikeRequests.add(postId);

    apiClient.post(`${ApiRoutes.LIKE.TOGGLE}/${postId}`).catch(() => {
      runInAction(() => {
        post.liked_by_me = prev;
        post.likes_count -= delta;
      });
    }).finally(() => {
      this.activeLikeRequests.delete(postId);
    });
  }
}

export default new PostStore();
