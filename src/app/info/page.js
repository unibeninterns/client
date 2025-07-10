"use client";

import { useEffect, useState } from "react";
import { infoApi } from "@/lib/api";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Search, FileText, Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export default function InfoDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState("publish_date");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchDocuments = async (page = 1, query = "") => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
              Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, pagination.totalCount)} of {pagination.totalCount} documents
            </div>
          )}
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6