"use client";

import { useEffect, useState, useCallback } from "react";
import { infoApi } from "@/lib/api";
import {
  FileText,
  Plus,
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

  const handleDeleteDocument = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setDeleteLoading(id);
      await infoApi.deleteInfoDocument(id);
      showNotification("Document deleted successfully!", "success");
      fetchDocuments(currentPage, searchQuery);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Info Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage information documents and resources
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </form>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="publish_date">Date</option>
              <option value="title">Title</option>
              <option value="views.count">Views</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Documents ({pagination.totalCount || 0})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
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
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      No documents found
                    </p>
                    <p>Upload your first info document to get started.</p>
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr
                    key={document._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">
                            {getFileIcon(document.file_type)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {document.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {document.original_filename}
                          </div>
                          {document.description && (
                            <div className="text-xs text-gray-400 mt-1 truncate">
                              {document.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(document.publish_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {document.views?.count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatFileSize(document.file_size)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          key={document._id}
                          href={`/admin/info/${document._id}`}
                          className="p-2 text-gray-400 hover:text-fuchsia-600 transition-colors"
                          title="View document"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            window.open(document.info_doc, "_blank")
                          }
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDocument(document._id, document.title)
                          }
                          disabled={deleteLoading === document._id}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete document"
                        >
                          {deleteLoading === document._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, pagination.totalCount)} of{" "}
                {pagination.totalCount} documents
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

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
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          isCurrentPage
                            ? "bg-fuchsia-600 text-white"
                            : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
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
                      <span key={page} className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    </div>
  );
}
