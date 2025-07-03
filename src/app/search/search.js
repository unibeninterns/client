"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { articlesApi, facultyApi, departmentApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import {
  ArrowLeft,
  Filter,
  X,
  Search,
  Calendar,
  Eye,
  BookOpen,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const SearchClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialFaculty = searchParams.get("faculty") || "";
  const initialDepartment = searchParams.get("department") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(initialFaculty);
  const [selectedDepartment, setSelectedDepartment] =
    useState(initialDepartment);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Categories for research types
  const categories = ["Research", "Innovation", "Development"];

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const facultiesData = await facultyApi.getFaculties();
        const departmentsData = await departmentApi.getDepartments();

        if (facultiesData?.data && Array.isArray(facultiesData.data)) {
          setFaculties(facultiesData.data);
        }

        if (departmentsData?.data && Array.isArray(departmentsData.data)) {
          setDepartments(departmentsData.data);
          setFilteredDepartments(departmentsData.data);
        }
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    if (selectedFaculty && departments.length > 0) {
      const filtered = departments.filter(
        (dept) => dept.faculty === selectedFaculty
      );
      setFilteredDepartments(filtered);

      if (filtered.length > 0 && selectedDepartment) {
        const deptExists = filtered.some(
          (dept) => dept.code === selectedDepartment
        );
        if (!deptExists) {
          setSelectedDepartment("");
        }
      }
    } else {
      setFilteredDepartments(departments);
    }
  }, [selectedFaculty, departments, selectedDepartment]);

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

  const handleSearch = (e) => {
    e?.preventDefault();
    performSearch();
    updateSearchParams();
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedFaculty("");
    setSelectedDepartment("");
    setIsFilterOpen(false);
  };

  useEffect(() => {
    if (
      initialQuery ||
      initialCategory ||
      initialFaculty ||
      initialDepartment
    ) {
      performSearch();
    }
  }, [
    initialQuery,
    initialCategory,
    initialFaculty,
    initialDepartment,
    performSearch,
  ]);

  const activeFiltersCount = [
    selectedCategory,
    selectedFaculty,
    selectedDepartment,
  ].filter(Boolean).length;

  return (
    <>
      <Header isSearchPage={true} />
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-white pt-16 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center text-fuchsia-900 hover:text-fuchsia-700 hover:bg-fuchsia-100 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back</span>
            </Button>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-fuchsia-900">
                Search Research Articles
              </h1>
              <p className="text-fuchsia-600 mt-1">
                Discover knowledge from UNIBEN
              </p>
            </div>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>

          {/* Enhanced Search Form */}
          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 mb-8 border border-fuchsia-100">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Main Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-fuchsia-400" />
                </div>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for research articles, innovations, developments..."
                  className="pl-12 pr-4 py-4 text-lg border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-200 rounded-xl"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="submit"
                  className="bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Search size={18} />
                  Search Articles
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Filter size={18} />
                  Advanced Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-fuchsia-600 text-white rounded-full text-sm font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Advanced Filters Panel */}
              {isFilterOpen && (
                <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 p-6 rounded-xl border border-fuchsia-200 mt-6 animate-in slide-in-from-top duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-fuchsia-900 flex items-center gap-2">
                      <Filter size={20} />
                      Advanced Filters
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-fuchsia-600 hover:text-fuchsia-800 hover:bg-fuchsia-100"
                      >
                        Clear All
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                        className="text-fuchsia-600 hover:text-fuchsia-800 hover:bg-fuchsia-100"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Categories */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-fuchsia-800 mb-3">
                        Research Category
                      </label>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategory === category}
                              onCheckedChange={() => {
                                setSelectedCategory(
                                  selectedCategory === category ? "" : category
                                );
                              }}
                              className="border-fuchsia-300 text-fuchsia-600 focus:ring-fuchsia-200"
                            />
                            <label
                              htmlFor={`category-${category}`}
                              className="text-sm font-medium text-fuchsia-700 cursor-pointer hover:text-fuchsia-900"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Faculty */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-fuchsia-800 mb-3">
                        Faculty
                      </label>
                      <select
                        value={selectedFaculty}
                        onChange={(e) => setSelectedFaculty(e.target.value)}
                        className="w-full rounded-xl border-fuchsia-200 shadow-sm focus:border-fuchsia-400 focus:ring-fuchsia-200 py-3 px-4 text-sm"
                      >
                        <option value="">All Faculties</option>
                        {faculties.map((faculty) => (
                          <option key={faculty._id} value={faculty.code}>
                            {faculty.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Department */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-fuchsia-800 mb-3">
                        Department
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full rounded-xl border-fuchsia-200 shadow-sm focus:border-fuchsia-400 focus:ring-fuchsia-200 py-3 px-4 text-sm"
                        disabled={filteredDepartments.length === 0}
                      >
                        <option value="">All Departments</option>
                        {filteredDepartments.map((department) => (
                          <option key={department._id} value={department.code}>
                            {department.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Search Results */}
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                  <p className="text-fuchsia-700 font-medium">
                    Searching articles...
                  </p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-fuchsia-900 flex items-center gap-2">
                      <TrendingUp size={24} />
                      Search Results
                    </h2>
                    <p className="text-fuchsia-600 mt-1">
                      Found {results.length}{" "}
                      {results.length === 1 ? "article" : "articles"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {results.map((article) => (
                    <Link
                      href={`/articles/${article._id}`}
                      key={article._id}
                      className="group bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-fuchsia-100 hover:border-fuchsia-200"
                    >
                      <div className="relative">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center px-3 py-1 bg-fuchsia-900 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                            <BookOpen size={12} className="mr-1" />
                            {article.category}
                          </span>
                        </div>
                        {article.cover_photo ? (
                          <Image
                            src={getImageUrl(article.cover_photo)}
                            alt={article.title}
                            width={400}
                            height={240}
                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center">
                            <BookOpen size={48} className="text-fuchsia-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-bold text-fuchsia-900 mb-3 line-clamp-2 group-hover:text-fuchsia-700 transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.department?.title && (
                            <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs rounded-full">
                              {article.department.title}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-fuchsia-50">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>
                              {new Date(
                                article.publish_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>
                              {calculateReadingTime(
                                article.content || article.summary || ""
                              )}{" "}
                              min
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-fuchsia-100">
                {query ||
                selectedCategory ||
                selectedFaculty ||
                selectedDepartment ? (
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-fuchsia-900 mb-4">
                      No Results Found
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      We couldn&apos;t find any articles matching your search
                      criteria. Try adjusting your filters or search terms.
                    </p>

                    <Button
                      onClick={clearFilters}
                      className="bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 mt-2"
                    >
                      Clear filters and try again
                    </Button>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-6">🔎</div>
                    <h3 className="text-2xl font-bold text-fuchsia-900 mb-4">
                      Start Searching
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Enter at least 3 characters or select filters to find
                      articles.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchClient;
