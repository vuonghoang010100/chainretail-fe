import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.VENDOR;

export const VendorService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Vendor");
    } catch (error) {
      console.error("getAll Vendor error:", error);
      throw error;
    }
  },
  getVendorById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getVendorById");
    } catch (error) {
      console.error("getVendorById error:", error);
      throw error;
    }
  },
  postVendor: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postVendor");
    } catch (error) {
      console.error("postVendor error:", error);
      throw error;
    }
  },
  putVendor: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putVendor");
    } catch (error) {
      console.error("putVendor error:", error);
      throw error;
    }
  },
}