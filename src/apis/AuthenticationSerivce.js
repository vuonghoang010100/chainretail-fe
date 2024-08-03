import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.AUTHENTICATION;

export const AuthenticationSerivce = {
  
  login: async (data) => {
    try {
      const response = await api.post(ENDPOINT.concat("/login"), data);
      if (response.status === 200 && response.data.code === 0)
        return response.data?.result;
      throw new Error("Uncatch status login");
    } catch (error) {
      console.error("Login error", error)
      throw error;
    }
  },
}