import axios from "@/api/axios";

export const userService = {

  graduates: {
    getAll: () => axios.get("/users/graduates"),
    create: (data) => axios.post("/users/graduates", data),
    update: (id, data) => axios.put(`/users/graduates/${id}`, data),
    delete: (id) => axios.delete(`/users/graduates/${id}`),
  },

  staff: {
    getAll: () => axios.get("/users/staff"),
    create: (data) => axios.post("/users/staff", data),
    update: (id, data) => axios.put(`/users/staff/${id}`, data),
    delete: (id) => axios.delete(`/users/staff/${id}`),
  },

  admins: {
    getAll: () => axios.get("/users/admins"),
    create: (data) => axios.post("/users/admins", data),
    update: (id, data) => axios.put(`/users/admins/${id}`, data),
    delete: (id) => axios.delete(`/users/admins/${id}`),
  },

};