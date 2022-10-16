import axios from "axios";
const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:3500";
export default axios.create({
  baseURL,
});
export const axiosPrivate = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
