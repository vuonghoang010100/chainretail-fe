import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.REPORT;

export const ReportSerivce = {
  getReport: async (id, query) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id), { params: query });
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Uncatch status getReport");
    } catch (error) {
      console.error("getReport error:", error);
      throw error;
    }
  }
}