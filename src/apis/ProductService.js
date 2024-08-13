import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.PRODUCT;

export const ProductService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Product");
    } catch (error) {
      console.error("getAll Product error:", error);
      throw error;
    }
  },
  getProductById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getProductById");
    } catch (error) {
      console.error("getProductById error:", error);
      throw error;
    }
  },
  postProduct: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postProduct");
    } catch (error) {
      console.error("postProduct error:", error);
      throw error;
    }
  },
  putProduct: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putProduct");
    } catch (error) {
      console.error("putProduct error:", error);
      throw error;
    }
  },
}