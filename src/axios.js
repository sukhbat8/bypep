import axios from "axios";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if(error.response.status === 401 && window.location.pathname !== '/login') {
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);
