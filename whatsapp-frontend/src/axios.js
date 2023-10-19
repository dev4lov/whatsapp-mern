import axios from "axios";

const instance = axios.create({
  baseURL: "http://whatsapp-mern-api.vercel.app",
});

export default instance;
