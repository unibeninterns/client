"use client";

import { useEffect, useState, useCallback } from "react";
import { infoApi } from "@/lib/api";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Search,
  FileText,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
  User,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";

export default function InfoDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState("publish_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchDocuments = useCallback(
    async (page = 1, query = "") => {
      try {
        setLoading(true);
        const response = await infoApi.getInfoDocuments({
          page,
          limit: 12,
          q: query,
          sort: sortBy,
          order: sortOrder,
        });

        setDocuments(response.documents);
        setPagination(response.pagination);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching info documents:", error);
      } finally {
        setLoading(false);
      }
    },
    [sortBy, sortOrder]
  );

  // Delayed search implementation
  const performSearch = useCallback(() => {
    if (searchQuery.length >= 3 || searchQuery.length === 0) {
      fetchDocuments(1, searchQuery);
    }
  }, [searchQuery, fetchDocuments]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch();
    }, 500);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchQuery, performSearch, searchTimeout]);

  useEffect(() => {
    fetchDocuments(1, searchQuery);
  }, [sortBy, sortOrder, fetchDocuments, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    fetchDocuments(page, searchQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes("pdf")) return "📄";
    if (fileType?.includes("word") || fileType?.includes("document"))
      return "📝";
    if (fileType?.includes("powerpoint") || fileType?.includes("presentation"))
      return "📊";
    if (fileType?.includes("excel") || fileType?.includes("spreadsheet"))
      return "📈";
    if (fileType?.includes("csv")) return "📊";
    return "📄";
  };

  const getFileTypeName = (fileType) => {
    if (fileType?.includes("pdf")) return "PDF";
    if (fileType?.includes("word") || fileType?.includes("document"))
      return "DOC";
    if (fileType?.includes("powerpoint") || fileType?.includes("presentation"))
      return "PPT";
    if (fileType?.includes("excel") || fileType?.includes("spreadsheet"))
      return "XLS";
    if (fileType?.includes("csv")) return "CSV";
    return "FILE";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-fuchsia-50/30 to-white border-b border-gray-200 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-fuchsia-100/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-fuchsia-100/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-fuchsia-300 rounded-full opacity-60"></div>
          <div className="absolute top-40 right-1/3 w-1 h-1 bg-fuchsia-400 rounded-full opacity-40"></div>
          <div className="absolute bottom-32 left-1/2 w-1.5 h-1.5 bg-fuchsia-200 rounded-full opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Header */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-fuchsia-100/60 backdrop-blur-sm rounded-full text-fuchsia-700 text-sm font-medium mb-6 hover:bg-fuchsia-100/80 transition-all duration-300 cursor-default">
                <div className="w-2 h-2 bg-fuchsia-500 rounded-full mr-2 animate-pulse"></div>
                UNIBEN Research Hub
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="block">Discover</span>
                <span className="block bg-gradient-to-r from-fuchsia-600 via-fuchsia-700 to-fuchsia-800 bg-clip-text text-transparent">
                  Research Excellence
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore cutting-edge academic papers, groundbreaking research
                findings, and institutional reports from the University of Benin
              </p>

              {/* Research Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-8 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-fuchsia-600" />
                  </div>
                  <span>10,000+ Documents</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-fuchsia-600" />
                  </div>
                  <span>500+ Researchers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-fuchsia-600" />
                  </div>
                  <span>1M+ Views</span>
                </div>
              </div>
            </div>

            {/* Enhanced Search Section */}
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative group">
                <div className="relative">
                  {/* Search Input Container */}
                  <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group-focus-within:shadow-xl group-focus-within:border-fuchsia-300">
                    {/* Search Icon */}
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                      <Search className="w-5 h-5 text-gray-400 group-focus-within:text-fuchsia-500" />
                    </div>

                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search for research papers, authors, topics..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-14 pr-32 py-5 lg:py-6 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none text-lg bg-transparent"
                    />

                    {/* Character Counter for Mobile */}
                    {searchQuery.length > 0 && searchQuery.length < 3 && (
                      <div className="absolute right-24 top-1/2 transform -translate-y-1/2 sm:hidden">
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>{3 - searchQuery.length} more</span>
                        </div>
                      </div>
                    )}

                    {/* Search Button */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {searchQuery.length >= 3 ? (
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 hover:from-fuchsia-700 hover:to-fuchsia-800 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        >
                          <span className="hidden sm:inline">Search</span>
                          <Search className="w-4 h-4 sm:hidden" />
                        </button>
                      ) : (
                        <div className="bg-gray-100 text-gray-400 px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold cursor-not-allowed">
                          <span className="hidden sm:inline">Search</span>
                          <Search className="w-4 h-4 sm:hidden" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Search Progress Indicator */}
                  {searchQuery.length > 0 && searchQuery.length < 3 && (
                    <div className="absolute -bottom-12 left-6 right-6 hidden sm:block">
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Minimum 3 characters required</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-fuchsia-500 h-1 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(searchQuery.length / 3) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="ml-1 font-medium">
                              {searchQuery.length}/3
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>

              {/* Search Suggestions/Quick Actions */}
              <div className="mt-8 lg:mt-12">
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-500 font-medium">
                    Popular searches:
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {[
                    "Artificial Intelligence",
                    "Climate Change",
                    "Biotechnology",
                    "Social Sciences",
                    "Engineering",
                    "Medicine",
                  ].map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 bg-white hover:bg-fuchsia-50 text-gray-600 hover:text-fuchsia-700 rounded-full text-sm border border-gray-200 hover:border-fuchsia-200 transition-all duration-300 transform hover:scale-105"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Sort by:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all min-w-[140px]"
                >
                  <option value="publish_date">Date Published</option>
                  <option value="title">Title</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </span>
                </button>
              </div>
            </div>

            {pagination.totalCount && (
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">{pagination.totalCount}</span>{" "}
                documents found
                {searchQuery && (
                  <span className="ml-2 text-fuchsia-600">
                    for &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Documents List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No documents match your search "${searchQuery}"`
                : "No documents have been uploaded yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <Link
                key={document._id}
                href={`/info/${document._id}`}
                className="block bg-white rounded-xl border border-gray-200 hover:border-fuchsia-200 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 rounded-lg flex items-center justify-center text-2xl group-hover:from-fuchsia-200 group-hover:to-fuchsia-300 transition-all">
                        {getFileIcon(document.file_type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Title and File Type */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-fuchsia-600 transition-colors line-clamp-2">
                              {document.title}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                              {getFileTypeName(document.file_type)}
                            </span>
                          </div>

                          {/* Description */}
                          {document.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {document.description}
                            </p>
                          )}

                          {/* Meta Information */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(document.publish_date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{document.views?.count || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              <span>{formatFileSize(document.file_size)}</span>
                            </div>
                            {document.owner?.username && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{document.owner.username}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center px-4 py-2 bg-fuchsia-50 text-fuchsia-700 rounded-lg font-medium group-hover:bg-fuchsia-100 transition-colors">
                            <FileText className="w-4 h-4 mr-2" />
                            View Document
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasPrev
                    ? "text-gray-700 hover:bg-gray-50"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1 mx-2">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  const isCurrentPage = pageNum === currentPage;
                  const showPage =
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                  if (!showPage) {
                    if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 py-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        isCurrentPage
                          ? "bg-fuchsia-600 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasNext
                    ? "text-gray-700 hover:bg-gray-50"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
