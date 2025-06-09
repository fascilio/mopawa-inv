import axios from 'axios';

const api = axios.create({
 // baseURL: 'http://localhost:5000/api', // your backend server URL    https://www.mopawa.co.ke/
  baseURL: process.env.REACT_APP_BASE_URL
});

export default api;
