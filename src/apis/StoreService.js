import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.STORE;

export const StoreService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query });
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Store");
    } catch (error) {
      console.error("getAll Store error:", error);
      throw error;
    }
  },
  search: async (search) => {
    return StoreService.getAll({ page: 1, size: search ? 200 : 20, search });
  },
  getWorkStore: async() => {
    try {
      const response = await api.get(ENDPOINT.concat("/work"))
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getWorkStore");
    } catch (error) {
      console.error("getWorkStore error:", error);
      throw error;
    }
  },
  getStoreById: async (id) => {
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
  postStore: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postStore");
    } catch (error) {
      console.error("postStore error:", error);
      throw error;
    }
  },
  putStore: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putStore");
    } catch (error) {
      console.error("putStore error:", error);
      throw error;
    }
  },
};
