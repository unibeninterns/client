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
};

const performSearch = useCallback(async () => {
  if (
    query.length < 3 &&
    !selectedCategory &&
    !selectedFaculty &&
    !selectedDepartment
  ) {
    return;
  }

  setLoading(true);
  try {
    const searchParams = {};
    if (query && query.length >= 3) searchParams.q = query;
    if (selectedCategory) searchParams.category = selectedCategory;
    if (selectedFaculty) searchParams.faculty = selectedFaculty;
    if (selectedDepartment) searchParams.department = selectedDepartment;

    const articles = await articlesApi.getPublicArticles(searchParams);
    setResults(Array.isArray(articles) ? articles : []);
  } catch (error) {
    console.error("Search error:", error);
    setResults([]);
  } finally {
    setLoading(false);
  }
}, [query, selectedCategory, selectedFaculty, selectedDepartment]);

const updateSearchParams = () => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (selectedCategory) params.set("category", selectedCategory);
  if (selectedFaculty) params.set("faculty", selectedFaculty);
  if (selectedDepartment) params.set("department", selectedDepartment);
  router.push(`/search?${params.toString()}`, { scroll: false });
};
