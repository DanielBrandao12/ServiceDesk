import axios from "axios";

const baseURL = import.meta.env.VITE_DOMINIO_HOST;


if (!baseURL) {
 
  throw new Error("REACT_APP_DOMINIO_HOST não definida no .env");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  
});


export default api;