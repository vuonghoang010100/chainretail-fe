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
}