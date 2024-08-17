import { api } from "@/apis/configs/axiosConfig";
import Endpoints from "@/constants/Endpoints";

const ENDPOINT = Endpoints.FILE;

export const FileService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file)
    try {
      const response = await api.post(
        ENDPOINT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201 && response.data?.code === 0) {
        return response.data.result;
      }
      throw new Error("Uncatch status upload file");
    } catch (error) {
      console.error("upload file error:", error);
      throw error;
    }
  },
};
