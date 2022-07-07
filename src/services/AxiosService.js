import { message } from "antd";
import axios from "axios";

export const getRequest = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log({ ...err });
    message.error(`${err.response.data.errors[0]}`);
    // notification.error({
    //   message: err.response.statusText,
    //   description: err.response.data.errors[0]
    // })
    return null;
  }
};
export const deleteRequest = async (url, body) => {
  try {
    console.log(body);
    const res = await axios.delete(url, { data: body });
    return res.data;
  } catch (err) {
    console.log({ ...err });
    message.error(`${err.response.data.errors[0]}`);
    // notification.error({
    //   message: err.response.statusText,
    //   description: err.response.data.errors[0]
    // })
    return null;
  }
};

export const postRequest = async (url, body) => {
  try {
    const res = await axios.post(url, body);
    return res.data;
  } catch (err) {
    console.log({ ...err });
    message.error(`${err.response.data.errors[0]}`);
    // notification.error({
    //   message: err.response.statusText,
    //   description: err.response.data.errors[0]
    // })
    return null;
  }
};
export const putRequest = async (url, body) => {
  try {
    const res = await axios.put(url, body);
    return res.data;
  } catch (err) {
    console.log({ ...err });
    message.error(`${err.response.data.errors[0]}`);
    // notification.error({
    //   message: err.response.statusText,
    //   description: err.response.data.errors[0]
    // })
    return null;
  }
};

export const getLists = async (url) => {
  try {
    const res = await axios.get(url);
    return {
      total: res.headers.total,
      data: res.data,
    };
  } catch (err) {
    console.log({ ...err });
    message.error(`${err.response.data.errors[0]}`);
    return null;
  }
};

export const preFilter = (filters) => {
  let filterString = "";
  if (filters) {
    const values = Object.keys(filters)
      .filter((key) => filters[key])
      .map((key) => `${key}=${filters[key]}`);
    filterString = `${values.join("&")}&`;
  }
  return filterString;
}