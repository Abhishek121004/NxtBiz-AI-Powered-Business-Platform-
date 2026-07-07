import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const normalizedApiBaseUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;

export const api = axios.create({
  baseURL: normalizedApiBaseUrl,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nxtbiz.accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  const data = error.response?.data;
  const issues = data?.issues;

  if (Array.isArray(issues) && issues.length > 0) {
    return issues
      .map((issue) => {
        const field = issue.path ? `${issue.path.charAt(0).toUpperCase()}${issue.path.slice(1)}: ` : '';
        return `${field}${issue.message}`;
      })
      .join('; ');
  }

  return data?.message || fallback;
}
