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
      throw new Error("Uncatch status getAll Staff");
    } catch (error) {
      console.error("getAll Staff error:", error);
      throw error;
    }
  },
  search: async (search) => {
    return StoreService.getAll({ page: 1, size: search ? 200 : 20, search });
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
};
