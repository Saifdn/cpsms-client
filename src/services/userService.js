import axios from "@/api/axios";

export const userService = {

  graduates: {
    getAll: ({page, limit, search} = {}) =>
      axios.get("/users/graduates", { params: { page, limit, search: search || undefined } }),
    create: (data) => axios.post("/users/graduates", data),
    update: (id, data) => axios.put(`/users/graduates/${id}`, data),
    delete: (id) => axios.delete(`/users/graduates/${id}`),
  },

  staff: {
    getAll: ({page, limit, search} = {}) =>
      axios.get("/users/staff", { params: { page, limit, search: search || undefined } }),
    create: (data) => axios.post("/users/staff", data),
    update: (id, data) => axios.put(`/users/staff/${id}`, data),
    delete: (id) => axios.delete(`/users/staff/${id}`),
  },

  admins: {
    getAll: ({page, limit, search} = {}) =>
      axios.get("/users/admins", { params: { page, limit, search: search || undefined } }),
    create: (data) => axios.post("/users/admins", data),
    update: (id, data) => axios.put(`/users/admins/${id}`, data),
    delete: (id) => axios.delete(`/users/admins/${id}`),
  },

};