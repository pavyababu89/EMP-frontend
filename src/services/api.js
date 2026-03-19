import axios from 'axios';

const API = axios.create({
  // baseURL: 'https://shudarshini.pythonanywhere.com/api',
  baseURL: import.meta.env.VITE_API_URL
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API calls — Auth
export const loginAPI = (data) => API.post('/token/', data);

// API calls — Employees
export const getEmployeesAPI = () => API.get('/employees/');
export const getMyProfileAPI = () => API.get('/employees/me/');
export const createEmployeeAPI = (data) => API.post('/employees/', data);
export const updateEmployeeAPI = (id, data) => API.put(`/employees/${id}/`, data);
export const deleteEmployeeAPI = (id) => API.delete(`/employees/${id}/`);

// API calls — Departments
export const getDepartmentsAPI = () => API.get('/departments/');
export const createDepartmentAPI = (data) => API.post('/departments/', data);
export const updateDepartmentAPI = (id, data) => API.put(`/departments/${id}/`, data);
export const deleteDepartmentAPI = (id) => API.delete(`/departments/${id}/`);

// API calls — Attendance
export const getAttendanceAPI = () => API.get('/attendance/');
export const markAttendanceAPI = (data) => API.post('/attendance/', data);
export const updateAttendanceAPI = (id, data) => API.put(`/attendance/${id}/`, data);

// API calls — Leaves
export const getLeavesAPI = () => API.get('/leaves/');
export const applyLeaveAPI = (data) => API.post('/leaves/', data);
export const updateLeaveStatusAPI = (id, data) => API.patch(`/leaves/${id}/`, data);

// API calls — Daily Updates
export const getDailyUpdatesAPI = () => API.get('/daily-updates/');
export const submitDailyUpdateAPI = (data) => API.post('/daily-updates/', data);

export default API;