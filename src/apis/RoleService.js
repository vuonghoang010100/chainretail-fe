import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.ROLE;

export const RoleSerivce = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query });
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Staff");
    } catch (error) {
      console.error("getAll Staff error:", error);
      throw error;
    }
  },
  search: async (search) => {
    return RoleSerivce.getAll({ page: 1, size: search ? 200 : 20, search });
  },
  getRoleById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getStaffById");
    } catch (error) {
      console.error("getStaffById error:", error);
      throw error;
    }
  },
  postRole: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postRole");
    } catch (error) {
      console.error("postRole error:", error);
      throw error;
    }
  },
  putRole: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putRole");
    } catch (error) {
      console.error("putRole error:", error);
      throw error;
    }
  },
};
