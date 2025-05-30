import axios from 'axios';

const api = axios.create({
 // baseURL: 'http://localhost:5000/api', // your backend server URL    https://www.mopawa.co.ke/
  baseURL: 'https://www.mopawa.co.ke'
});

export default api;
