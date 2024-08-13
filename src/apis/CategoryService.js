import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.CATEGORY;

export const CategoryService = {
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
    return CategoryService.getAll({ page: 1, size: search ? 200 : 20, search });
  },
  getCategoryById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getCategoryById");
    } catch (error) {
      console.error("getCategoryById error:", error);
      throw error;
    }
  },
  postCategory: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postCategory");
    } catch (error) {
      console.error("postCategory error:", error);
      throw error;
    }
  },
  putCategory: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putCategory");
    } catch (error) {
      console.error("putSputCategorytore error:", error);
      throw error;
    }
  },
};
