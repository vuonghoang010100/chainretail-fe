import { api } from "./configs/axiosConfig";

const endpoint = "/branches";

export const branchStatus = ["Đang hoạt động", "Dừng hoạt động"];

const color = ["#52C41A", "rgba(0,0,0,0.45)"];

export const branchStatusColor = Object.fromEntries(
  branchStatus.map((value, index) => [value, color[index]])
);

export const StoreAPI = {
  getStores: async ({
    page = 1,
    pageSize = 10,
    condition = null,
    status = null,
    province = null,
    district = null,
  }) => {
    // preprocess params
    const params = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    if (!!condition) {
      try {
        return StoreAPI.searchStore(condition, params);
      } catch (error) {
        throw error;
      }
    }

    !!status && (params.status = status);
    !!province && (params.province = province);
    !!district && (params.district = district);

    try {
      const response = await api.get(endpoint, { params });
      if (
        response?.status === 200 &&
        response?.data?.meta?.message_code === "SUCCESS."
      ) {
        return response.data;
      }
      throw new Error("Uncatch status");
    } catch (error) {
      console.error("Error getCustomers", { params, error });
      throw error;
    }
  },
  searchStore: async (
    condition,
    params = {
      limit: 10,
      offset: 0,
    }
  ) => {
    try {
      const response = await api.get("/branch/search", {
        params: { ...params, condition: condition },
      });

      if (
        response?.status === 200 &&
        response?.data?.meta?.message_code === "SUCCESS."
      ) {
        console.info(`search: ${condition}`, response.data);
        return response.data;
      }
      throw new Error("Uncatch status");
    } catch (error) {
      console.error("Error searchStores", { condition, error });
      throw error;
    }
  },
  getStoreById: async (id) => {
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
      console.error(`Error getStoreById: ${id}`, error);
      throw error;
    }
  },
  postStore: async (data) => {
    try {
      const response = await api.post(endpoint, data);
      if (
        response.status === 200 //&&
        // response.data?.meta?.message_code === "SUCCESS."
      ) {
        return response.data.data;
      }
      throw new Error("Uncatch status");
    } catch (error) {
      console.error("Error postStore", { postData: data, error });
      throw error;
    }
  },
  putStore: async (id, data) => {
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
      console.error("Error putCustomer", {
        putData: data,
        error: error,
      });
      throw error;
    }
  },
  deleteStore: async (id) => {
    try {
      const response = await api.delete(endpoint.concat(`/${id}`));
      if (
        response.status === 200 &&
        response.data.meta.message_code === "DELETED_SUCCESSFULLY"
      ) {
        return true;
      }
    } catch (error) {
      console.error("Error deleteCustomer", { id, error });
      throw error;
    }
  },
};
