import axios from "axios";
import { getLists, getRequest, putRequest, postRequest, preFilter } from "./AxiosService";

class BarongApiService {
  baseUrl = "/api/v2/barong";

  login = async (data) => {
    return await axios.post(`${this.baseUrl}/identity/sessions`, data);
  };

  getUsers = async (page, limit, filters) => {
    return await getLists(
      `${this.baseUrl}/admin/users?${preFilter(filters)}limit=${limit}&page=${page}&extended=true`
    );
  };

  getUserInfo = async () => {
    return await getRequest(`${this.baseUrl}/resource/users/me`);
  };

  logout = async () => {
    return await axios.delete(`${this.baseUrl}/identity/sessions`);
  };
  getUser = async (uid) => {
    return await getRequest(`${this.baseUrl}/admin/users/${uid}`);
  };
  postUserUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/users/labels/update`, body);
  }
  getActivities = async (page, limit, uid) => {
    return await getRequest(`${this.baseUrl}/admin/activities?page=${page}&limit=${limit}&uid=${uid}`);
  };
  getProfiles = async (key, value, page, limit) => {
    return await getRequest(`${this.baseUrl}/admin/users/labels?key=${key}&value=${value}&page=${page}&limit=${limit}`);
  };
  getPending = async (limit, page, filters) => {
    return await getLists(`${this.baseUrl}/admin/users/documents/pending?${preFilter(filters)}limit=${limit}&page=${page}&extended=true`);
  };
  getAbilities = async (body) => {
    return await getRequest(`${this.baseUrl}/admin/abilities`, body);
  };
  putProfileUpdate = async (body) => {
    return await putRequest(`${this.baseUrl}/admin/profiles`, body);
  }
  getWithrawalLevels = async () => {
    return await getRequest(`${this.baseUrl}/admin/levels`)
  }
}

export default new BarongApiService();
