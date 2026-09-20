import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  }, // this tell the backend that the data I am sending is JSON
});

// The following is the request interceptor that allows you to run some code before Axios sends a request.
/*
 think of this like :
 
    api.get("/videos")
        ↓
    Request interceptor
        ↓
    Add JWT token
        ↓
    Send request to backend
    
    */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
