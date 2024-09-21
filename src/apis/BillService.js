import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.BILL;

export const BillService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query });
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAllBill");
    } catch (error) {
      console.error("getAllBill error:", error);
      throw error;
    }
  },
  getBillById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getBillById");
    } catch (error) {
      console.error("getBillById error:", error);
      throw error;
    }
  },
  postBill: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postBill");
    } catch (error) {
      console.error("postBill error:", error);
      throw error;
    }
  },
  putBill: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putBill");
    } catch (error) {
      console.error("putSputBilltore error:", error);
      throw error;
    }
  },
};
