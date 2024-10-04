import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.SALE;


export const SaleService = {
  createSale: async (data) => {
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
  getAllOrders: async (query) => {
    try {
      const response = await api.get(ENDPOINT.concat("/orders"), { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAllOrders");
    } catch (error) {
      console.error("getAllOrders error:", error);
      throw error;
    }
  },
  getOrderById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/orders/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getOrderById");
    } catch (error) {
      console.error("getOrderById error:", error);
      throw error;
    }
  },
  putOrder: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putOrder");
    } catch (error) {
      console.error("putOrder error:", error);
      throw error;
    }
  },
  getAllInvoices: async (query) => {
    try {
      const response = await api.get(ENDPOINT.concat("/invoice"), { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAllInvoices");
    } catch (error) {
      console.error("getAllInvoices error:", error);
      throw error;
    }
  },
}