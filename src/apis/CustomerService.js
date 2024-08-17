import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.CUSTOMER;

export const CustomerService = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Customer");
    } catch (error) {
      console.error("getAll Customer error:", error);
      throw error;
    }
  },
  getCustomerById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getCustomerById");
    } catch (error) {
      console.error("getCustomerById error:", error);
      throw error;
    }
  },
  postCustomer: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postCustomer");
    } catch (error) {
      console.error("postCustomer error:", error);
      throw error;
    }
  },
  putCustomer: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putCustomer");
    } catch (error) {
      console.error("putCustomer error:", error);
      throw error;
    }
  },
}