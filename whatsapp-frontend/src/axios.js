import axios from "axios";

const instance = axios.create({
  baseURL: "https://whatsapp-mern-api.vercel.app",
});

export default instance;
