import { api_public } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.AUTHENTICATION;

export const AuthenticationSerivce = {
  login: async (data) => {
    try {
      const response = await api_public.post(ENDPOINT.concat("/login"), data);
      if (response.status === 200 && response.data.code === 0)
        return response.data?.result;
      throw new Error("Uncatch status login");
    } catch (error) {
      console.error("Login error", error)
      throw error;
    }
  },
  signup: async (data) => {
    try {
      const response = await api_public.post(ENDPOINT.concat("/signup"), data);
      if (response.status === 201 && response.data.code === 0)
        return response.data?.result;
      throw new Error("Uncatch status signup");
    } catch (error) {
      console.error("signup error", error)
      throw error;
    }
  }
}