import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.PROMOTE;

export const PromoteService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Promote");
    } catch (error) {
      console.error("getAll Promote error:", error);
      throw error;
    }
  },
  search: async (search, storeId, status) => {
    return PromoteService.getAll({ page: 1, size: search ? 200 : 20, search, storeId, status });
  },
  getPromoteById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getPromoteById");
    } catch (error) {
      console.error("getPromoteById error:", error);
      throw error;
    }
  },
  postPromote: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postPromote");
    } catch (error) {
      console.error("postPromote error:", error);
      throw error;
    }
  },
  putPromote: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putPromote");
    } catch (error) {
      console.error("putPromote error:", error);
      throw error;
    }
  },
}