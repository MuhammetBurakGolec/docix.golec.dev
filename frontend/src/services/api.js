import axios from "axios";

const API = axios.create({ baseURL: "http://mock-service:5002" });

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Hatası:", error);
    return Promise.reject(error);
  }
);

export const fetchPosts = () => API.get("/posts");
export const createPost = (post) => API.post("/posts", post);
export const likePost = (id, updatedPost) => API.put(`/posts/${id}`, updatedPost);
export const addComment = (postId, comment) =>
  API.put(`/posts/${postId}`, { comment });

const API_URL = 'http://mock-service:5002/api';

export const fetchContainers = async () => {
  const response = await axios.get(`${API_URL}/containers`);
  return response.data;
};

export const startContainer = async (id) => {
  const response = await axios.post(`${API_URL}/containers/${id}/start`);
  return response.data;
};

export const stopContainer = async (id) => {
  const response = await axios.post(`${API_URL}/containers/${id}/stop`);
  return response.data;
};

export const deleteContainer = async (id) => {
  const response = await axios.delete(`${API_URL}/containers/${id}`);
  return response.data;
};