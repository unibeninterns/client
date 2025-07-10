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
} from "lucide-react";

export default function InfoDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState("publish_date");
  const [sortOrder, setSortOrder] = useState("desc");

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

  useEffect(() => {
    fetchDocuments(1, searchQuery);
  }, [sortBy, sortOrder, searchQuery, fetchDocuments]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDocuments(1, searchQuery);
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Info Documents
            </h1>
            <p className="text-xl md:text-2xl text-fuchsia-100 mb-8">
              Access important documents, reports, and resources from UNIBEN
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="publish_date">Date Published</option>
              <option value="title">Title</option>
              <option value="views.count">Views</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {pagination.totalCount && (
            <div className="text-gray-600">
              Showing {(currentPage - 1) * 12 + 1} -{" "}
              {Math.min(currentPage * 12, pagination.totalCount)} of{" "}
              {pagination.totalCount} documents
            </div>
          )}
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Link
                key={document._id}
                href={`/info/${document._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">
                    {getFileIcon(document.file_type)}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    {document.views?.count || 0}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors line-clamp-2">
                  {document.title}
                </h3>

                {document.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {document.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(document.publish_date)}
                  </div>
                  <div className="text-xs">
                    {formatFileSize(document.file_size)}
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-800 group-hover:bg-fuchsia-200 transition-colors">
                    View Document
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                pagination.hasPrev
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-1">
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
                      <span key={pageNum} className="px-2 py-1 text-gray-500">
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
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isCurrentPage
                        ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
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
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                pagination.hasNext
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
