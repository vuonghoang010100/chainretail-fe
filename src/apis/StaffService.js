import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.STAFF;

export const StaffSerivce = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status == 200 && response.data?.code == 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Staff");
    } catch (error) {
      console.error("getAll Staff error:", error);
      throw error;
    }

  }
}