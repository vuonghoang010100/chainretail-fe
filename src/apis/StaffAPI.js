import { api } from "./configs/axiosConfig";

const endpoint = "/employees";

export const staffGenders = ["Nam", "Nữ"];
export const staffRoles = ["Quản lý", "Quản lý chi nhánh", "Nhân viên"];
export const staffStatuses = ["Đang làm việc", "Nghỉ việc"];

export const StaffAPI = {
  getStaffs: async ({
    page = 1,
    pageSize = 10,
    condition = null,
    ...filterParams
  }) => {
    let params = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    }

    if (!!condition) {
      try {
        return StaffAPI.searchStaff(condition, params);
      } catch (error) {
        throw error;
      }
    }

    params = {
      ...params,
      ...filterParams,
    }

    try {
      const response = await api.get(endpoint, { params });
      if (
        response?.status === 200 &&
        response?.data?.meta?.message_code === "SUCCESS."
      ) {
        return response.data;
      }
    } catch (error) {
      console.error("Error getStaffs", [params, error]);
      throw error;
    }
  },
  searchStaff: async (condition, params = {page : 1, pageSize : 10}) => {
    try {
      const response = await api.get("/employee/search", { params: {...params, condition} });
      if (
        response?.status === 200 &&
        response?.data?.meta?.message_code === "SUCCESS."
      ) {
        return response.data;
      }
      throw new Error("Uncatch status");
    } catch (error) {
      console.error("Error searchStaff", {condition, error});
      throw error;
    }
  },
  getStaffById: async (id) => {
    try {
      const response = await api.get(endpoint.concat(`/${id}`));
      if (
        response?.status === 200 &&
        response.data?.meta?.message_code === "SUCCESS."
      ) {
        return response.data.data;
      }
      throw new Error("Uncatch status");
    } catch (error) {
      console.error(`Error getCustomerById: ${id}`, error);
      throw error;
    }
  },
  postStaff: async (data) => {
    try {
      const response = await api.post(endpoint, data);
      if (
        response.status === 200 &&
        response.data?.meta?.message_code === "SUCCESS."
      ) {
        return response.data.data;
      }
      throw new Error("Uncatch status");
    } catch (error) {
      console.error("Error postStaff", {
        postData: data,
        error: error,
      });
      throw error;
    }
  },
  putStaff: async(id, data) => {
    try {
      const response = await api.put(endpoint.concat(`/${id}`), data);
      if (
        response.status === 200 &&
        response.data?.meta?.message_code === "UPDATE_SUCCESSFULLY"
      ) {
        return true;
      }
      throw new Error("Uncatch status");
    } catch (error) {
      console.error("Error putStaff", {
        putData: data,
        error: error,
      });
      throw error;
    }
  },
  deleteStaff: async (id) => {
    try {
      const response = await api.delete(endpoint.concat(`/${id}`));
      if (
        response.status === 200 &&
        response.data.meta.message_code === "DELETED_SUCCESSFULLY"
      ) {
        return true;
      }
    } catch (error) {
      console.error("Error deleteStaff", {
        id: id,
        error: error
      })
      throw error;
    }
  }
};
