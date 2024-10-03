import axios from "axios";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_API_URL;

// Axios instance default
export const api = axios.create({
  // withCredentials: true,  // TODO: check this later
  baseURL: baseURL,
});

// Axios instance default
export const api_public = axios.create({
  // withCredentials: true,
  baseURL: baseURL,
});

// // Alter defaults after instance has been created - links: https://axios-http.com/docs/config_defaults
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// TODO: use axios interceptors to intercept requests or responses

// Custom error handler for all APIs on response
// TODO: implement this
// code below is example of error handler

const errorHandler = (error) => {
  const statusCode = error.response?.status

  console.info("err", error)

  if (error.code === "ERR_CANCELED") {
      // TEST: notification error
      notification.error({
          placement: "bottomRight",
          description: "API canceled!",
      })
      return Promise.resolve()
  }

  // logging only errors that are not 401
  if (statusCode && statusCode === 401) {
    console.info(window.location.host)
    window.location = window.location.protocol + "//" + window.location.host + "/logout"
  }

  return Promise.reject(error)
}

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error)
})



