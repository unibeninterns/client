export const infoApi = {
  // Get all info documents with pagination and search (public)
  getInfoDocuments: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.append("q", params.q);
    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.sort) searchParams.append("sort", params.sort);
    if (params.order) searchParams.append("order", params.order);

    try {
      const response = await apiClient.get("/info", { params });
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message || "Failed to fetch info documents",
        error.response?.status || 500
      );
    }
  },

  // Get info document by ID (public)
  getInfoDocumentById: async (id) => {
    try {
      const response = await apiClient.get(`/info/${id}`);
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message || "Failed to fetch info document",
        error.response?.status || 500
      );
    }
  },

  // Record a view for an info document (public)
  recordView: async (id) => {
    try {
      const response = await apiClient.post(`/info-views/${id}/view`);
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message || "Failed to record view",
        error.response?.status || 500
      );
    }
  },

  // Get popular info documents (public)
  getPopularInfoDocuments: async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.append("limit", params.limit);
    if (params.period) searchParams.append("period", params.period);

    try {
      const response = await apiClient.get("/info-views/popular", { params });
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message ||
          "Failed to fetch popular info documents",
        error.response?.status || 500
      );
    }
  },

  // Admin: Create info document (authenticated)
  createInfoDocument: async (formData) => {
    return requestWithAuth({
      method: "post",
      url: "/info",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Delete info document (authenticated)
  deleteInfoDocument: async (id) => {
    return requestWithAuth({
      method: "delete",
      url: `/info/${id}`,
    });
  },
};
