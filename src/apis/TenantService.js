import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.TENANT;


export const TenantService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT)
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAllTenant");
    } catch (error) {
      console.error("getAllTenant error:", error);
      throw error;
    }
  },
  getTenantById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getTenantById");
    } catch (error) {
      console.error("getTenantById error:", error);
      throw error;
    }
  },
  active: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/active?tenantId=") + id);
      if (response.status === 200)
        return response.data.result;
      throw new Error("Uncatch status getTenantById");
    } catch (error) {
      console.error("getTenantById error:", error);
      throw error;
    }
  }
}