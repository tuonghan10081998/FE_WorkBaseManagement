import axiosClient from "./axiosClient";
const END_PONT = {
  TODOS: `taskCV/NhiemVu/GetTask/1`,
  ADD_TODO: `taskCV/NhiemVu/AddTask`,
  DELETE: `taskCV/Delete`,
  EMAIL: `email/Email`,
  ACCOUNT: `account/Post`,
  LOGIN: `account/PostLogin`,
  GETWORK: `Work/Get?action=Get`,
  GETSTAFF: `User/Get?action=Get`,
};

export const getToAPI = () => {
  return axiosClient.get(`${END_PONT.GETWORK}`);
};
export const GetStaff = () => {
  return axiosClient.get(`${END_PONT.GETSTAFF}`);
};
export const PostAPI = (taskData) => {
  return axiosClient.post(`${END_PONT.ADD_TODO}`, taskData);
};

export const DeleteAPI = (id) => {
  return axiosClient.delete(`${END_PONT.DELETE}/${id}`);
};

export const PostEmail = (email) => {
  return axiosClient.post(`${END_PONT.EMAIL}`, email);
};

export const PostAccount = (object) => {
  return axiosClient.post(`${END_PONT.ACCOUNT}`, object);
};

export const getAccount = (object) => {
  return axiosClient.post(`${END_PONT.LOGIN}`, object);
};
