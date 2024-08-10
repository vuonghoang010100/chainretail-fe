import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.STAFF;

export const StaffSerivce = {
  getAll: async (query) => {
    try {
      const response = await api.get(ENDPOINT, { params: query })
      if (response.status === 200 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status getAll Staff");
    } catch (error) {
      console.error("getAll Staff error:", error);
      throw error;
    }

  },
  getStaffById: async (id) => {
    try {
      const response = await api.get(ENDPOINT.concat("/" + id));
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status getStaffById");
    } catch (error) {
      console.error("getStaffById error:", error);
      throw error;
    }
  },
  postStaff: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      if (response.status === 201 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status postStaff");
    } catch (error) {
      console.error("postStaff error:", error);
      throw error;
    }
  },
  putStaff: async (id, data) => {
    try {
      const response = await api.put(ENDPOINT.concat("/" + id), data);
      if (response.status === 200 && response.data?.code === 0)
        return response.data.result;
      throw new Error("Uncatch status putStaff");
    } catch (error) {
      console.error("putStaff error:", error);
      throw error;
    }
  },
}