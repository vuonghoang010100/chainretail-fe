import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.CONTRACT;

export const ContractService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Contract");
    } catch (error) {
      console.error("getAll Contract error:", error);
      throw error;
    }
  },
  search: async (search, vendorId) => {
    return ContractService.getAll({ page: 1, size: 200, search, vendorId });
  },
  getContractById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getContractById");
    } catch (error) {
      console.error("getContractById error:", error);
      throw error;
    }
  },
  postContract: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postContract");
    } catch (error) {
      console.error("postVendor error:", error);
      throw error;
    }
  },
  putContract: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putContract");
    } catch (error) {
      console.error("putVendor error:", error);
      throw error;
    }
  },
}