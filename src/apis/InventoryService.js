import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.INVENTORY;

export const InventoryService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Inventory");
    } catch (error) {
      console.error("getAll Inventory error:", error);
      throw error;
    }
  },
  getInventoryById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getInventoryById");
    } catch (error) {
      console.error("getInventoryById error:", error);
      throw error;
    }
  },
  postInventory: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postInventory");
    } catch (error) {
      console.error("postInventory error:", error);
      throw error;
    }
  },
}