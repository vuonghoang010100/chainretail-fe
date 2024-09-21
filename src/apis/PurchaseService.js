import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.PURCHASE;

export const PurchaseService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Purchase");
    } catch (error) {
      console.error("getAll Purchase error:", error);
      throw error;
    }
  },
  search: async (search, vendorId) => {
    return PurchaseService.getAll({ page: 1, size: 200, search, vendorId, paymentStatus: "Chưa thanh toán"
     });
  },
  getPurchaseById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getPurchaseById");
    } catch (error) {
      console.error("getPurchaseById error:", error);
      throw error;
    }
  },
  postPurchase: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postPurchase");
    } catch (error) {
      console.error("postPurchase error:", error);
      throw error;
    }
  },
  putPurchase: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putPurchase");
    } catch (error) {
      console.error("putPurchase error:", error);
      throw error;
    }
  },
  receivePurchase: async (id, data) => {
    try {
      const response = await api.post(ENDPOINT.concat("/" + id).concat("/receive"), data)
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status receivePurchase");
    } catch (error) {
      console.error("receivePurchase error:", error);
      throw error;
    }
  }
}