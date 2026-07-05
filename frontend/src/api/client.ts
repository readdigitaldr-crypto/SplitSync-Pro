import axios, { AxiosError } from "axios";

export type ApiErrorPayload = {
  success?: false;
  errors?: unknown;
  detail?: string;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
    }
    return Promise.reject(error);
  },
);

export function listFromResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "results" in payload) {
    const results = (payload as { results?: unknown }).results;
    return Array.isArray(results) ? (results as T[]) : [];
  }
  return [];
}

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const data = error.response?.data;
    const errors = data?.errors ?? data?.detail ?? data;
    if (typeof errors === "string") return errors;
    if (errors && typeof errors === "object") {
      const first = Object.entries(errors as Record<string, unknown>)[0];
      if (first) {
        const [field, value] = first;
        const message = Array.isArray(value) ? value.join(" ") : String(value);
        return field === "detail" || field === "non_field_errors"
          ? message
          : `${field}: ${message}`;
      }
    }
  }
  return "Something went wrong. Please try again.";
}
