import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.BATCH;

export const BatchService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Batch");
    } catch (error) {
      console.error("getAll Batch error:", error);
      throw error;
    }
  },
  search: async (search, productId, storeId) => {
    return BatchService.getAll({ page: 1, size: 200, search, productId, storeId
     });
  },
  getBatchById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getBatchById");
    } catch (error) {
      console.error("getBatchById error:", error);
      throw error;
    }
  },
}