import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.TRANSFER;

export const TransferService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Transfer");
    } catch (error) {
      console.error("getAll Transfer error:", error);
      throw error;
    }
  },
  getTransferById: async (id) => {
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
  postTransfer: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postTransfer");
    } catch (error) {
      console.error("postTransfer error:", error);
      throw error;
    }
  },
  putTransfer: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putTransfer");
    } catch (error) {
      console.error("putTransfer error:", error);
      throw error;
    }
  },
}