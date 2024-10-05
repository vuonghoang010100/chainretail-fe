import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.DASHBOARD;

export const DashboardService = {
  getAll: async (from, to) => {
    try {
      const response = await api.get(ENDPOINT, { params: {from, to} })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Product");
    } catch (error) {
      console.error("getAll Product error:", error);
      throw error;
    }
  }, 
}