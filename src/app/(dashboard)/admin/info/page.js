"use client";

import { useEffect, useState, useCallback } from "react";
import { infoApi } from "@/lib/api";
import {
  FileText,
  PlusCircle,
  Search,
  Calendar,
  Eye,
  Trash2,
  ExternalLink,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function AdminInfoDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState("publish_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const showNotification = useCallback(
    (message, type) => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    },
    [setNotification]
  );

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  const fetchDocuments = useCallback(
    async (page = 1, query = "") => {
      try {
        setLoading(true);
        const response = await infoApi.getInfoDocuments({
          page,
          limit: 10,
          q: query,
          sort: sortBy,
          order: sortOrder,
        });

        setDocuments(response.documents);
        setPagination(response.pagination);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching info documents:", error);
        showNotification("Failed to fetch documents", "error");
      } finally {
        setLoading(false);
      }
    },
    [
      sortBy,
      sortOrder,
      setLoading,
      setDocuments,
      setPagination,
      setCurrentPage,
      showNotification,
    ]
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
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showNotification("Title is required", "error");
      return;
    }

    if (!formData.file) {
      showNotification("Please select a file", "error");
      return;
    }

    try {
      setCreateLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("info_doc", formData.file);

      await infoApi.createInfoDocument(formDataToSend);

      setShowCreateModal(false);
      setFormData({ title: "", description: "", file: null });
      showNotification("Document created successfully!", "success");
      fetchDocuments(1, searchQuery);
    } catch (error) {
      console.error("Error creating document:", error);
      showNotification(error.message || "Failed to create document", "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      setDeleteLoading(documentToDelete._id);
      await infoApi.deleteInfoDocument(documentToDelete._id);
      showNotification("Document deleted successfully!", "success");
      fetchDocuments(currentPage, searchQuery);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      showNotification(error.message || "Failed to delete document", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-fuchsia-50 to-purple-50 p-6 rounded-xl border border-fuchsia-100">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
            Info Documents
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage information documents and resources
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center px-4 py-2 rounded-md"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex-1 sm:max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-fuchsia-500" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-200 hover:border-gray-400 bg-white"
              >
                <option value="publish_date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="views.count">Sort by Views</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-200 hover:border-gray-400 bg-white"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1 text-fuchsia-500" />
              <span className="font-medium">{pagination.totalCount || 0}</span>
              <span className="ml-1">total documents</span>
            </div>
            {searchQuery && (
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-1 text-gray-400" />
                <span>Results for &quot;</span>
                <span className="font-medium text-fuchsia-600">
                  {searchQuery}
                </span>
                <span>&quot;</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-fuchsia-500" />
              Research Documents
            </h2>
            <div className="text-sm text-gray-500">
              {pagination.totalCount || 0} documents
            </div>
          </div>
        </div>

        {/* Mobile-First Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 hidden sm:table-header-group">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Enhanced loading state
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : documents.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 sm:px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">
                        No documents found
                      </p>
                      <p className="text-sm text-gray-400 mb-4">
                        {searchQuery
                          ? `No documents match "${searchQuery}". Try adjusting your search.`
                          : "Upload your first research document to get started."}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            fetchDocuments(1, "");
                          }}
                          className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr
                    key={document._id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    {/* Enhanced Mobile-First Document Cell */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 rounded-lg flex items-center justify-center group-hover:from-fuchsia-200 group-hover:to-fuchsia-300 transition-all duration-200">
                          <span className="text-lg">
                            {getFileIcon(document.file_type)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-fuchsia-700 transition-colors">
                                {document.title}
                              </h3>
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {document.original_filename}
                              </p>
                              {document.description && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 sm:line-clamp-1">
                                  {document.description}
                                </p>
                              )}
                              {/* Mobile-only stats */}
                              <div className="flex items-center space-x-4 mt-2 sm:hidden">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatDate(document.publish_date)}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {document.views?.count || 0}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatFileSize(document.file_size)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Desktop-only columns */}
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(document.publish_date)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center text-sm text-gray-900">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="font-medium">
                          {document.views?.count || 0}
                        </span>
                        <span className="text-gray-500 ml-1">views</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">
                      <span className="font-medium">
                        {formatFileSize(document.file_size)}
                      </span>
                    </td>

                    {/* Enhanced Actions Column */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/admin/info/${document._id}`}
                          className="p-2 text-gray-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-all duration-200 group/action"
                          title="View details"
                        >
                          <ExternalLink className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                        </Link>
                        <button
                          onClick={() =>
                            window.open(document.info_doc, "_blank")
                          }
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/action"
                          title="Download document"
                        >
                          <Download className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => {
                            setDocumentToDelete(document);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/action"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Mobile-Friendly Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-sm text-gray-700 text-center sm:text-left">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 10, pagination.totalCount)}
                </span>{" "}
                of <span className="font-medium">{pagination.totalCount}</span>{" "}
                documents
              </div>

              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                >
                  Previous
                </button>

                {/* Smart pagination for mobile */}
                <div className="hidden sm:flex items-center space-x-1">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                    const isFirstOrLast =
                      page === 1 || page === pagination.totalPages;

                    if (isNearCurrentPage || isFirstOrLast) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isCurrentPage
                              ? "bg-fuchsia-600 text-white shadow-sm"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Mobile pagination info */}
                <div className="sm:hidden flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg">
                  <span className="font-medium">{currentPage}</span>
                  <span className="mx-1">of</span>
                  <span className="font-medium">{pagination.totalPages}</span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
            <div
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Upload New Document
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateDocument} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                      placeholder="Enter document title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                      placeholder="Brief description of the document"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document File *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        formData.file
                          ? "border-fuchsia-300 bg-fuchsia-50"
                          : "border-gray-300 hover:border-fuchsia-300 hover:bg-fuchsia-50"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add(
                          "border-fuchsia-400",
                          "bg-fuchsia-100"
                        );
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-fuchsia-400",
                          "bg-fuchsia-100"
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-fuchsia-400",
                          "bg-fuchsia-100"
                        );
                        const files = Array.from(e.dataTransfer.files);
                        if (files.length > 0) {
                          setFormData({ ...formData, file: files[0] });
                        }
                      }}
                    >
                      <input
                        type="file"
                        onChange={(e) =>
                          setFormData({ ...formData, file: e.target.files[0] })
                        }
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt"
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        {formData.file ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {formData.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(formData.file.size)}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Drop your file here or click to browse
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, CSV, TXT
                              (Max 100MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {createLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && documentToDelete && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"></div>
            <div
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Document
                </h3>

                <p className="text-sm text-gray-600 text-center mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-900">
                    &quot;{documentToDelete.title}&quot;
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm">
                        {getFileIcon(documentToDelete.file_type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {documentToDelete.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {documentToDelete.original_filename}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDocumentToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteDocument}
                    disabled={deleteLoading === documentToDelete._id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                  >
                    {deleteLoading === documentToDelete._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
