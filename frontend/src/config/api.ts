import axios from "axios";
import { env } from "./env";

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});
