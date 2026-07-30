import axiosInstance from "../axiosInstance";

export const bannerApi = {
  getBanners: async (params = {}) => {
    const response = await axiosInstance.get("/banners", { params });
    return response.data;
  },
  createBanner: async (data) => {
    const response = await axiosInstance.post("/banners", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  updateBanner: async (id, data) => {
    const response = await axiosInstance.put(`/banners/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  deleteBanner: async (id) => {
    const response = await axiosInstance.delete(`/banners/${id}`);
    return response.data;
  },
};

export default bannerApi;
