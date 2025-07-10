"use client";

import { useEffect, useState } from "react";
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
  CheckCircle
} from "lucide-react";

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

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null
  });

  const fetchDocuments = async (page = 1, query = "") => {
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
  };

  useEffect(() => {
    fetchDocuments(1, searchQuery);
  }, [sortBy, sortOrder]);

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

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
    if (fileType?.includes('powerpoint') || fileType?.includes('presentation')) return '📊';
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return '📈';
    if (fileType?.includes('csv')) return '📊';
    return '📄';
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
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
          <p className="text-gray-600 mt-1">Manage information documents and resources</p>
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
                    <td className="px-6 py-