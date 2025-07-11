"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { infoApi } from "@/lib/api";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Eye,
  Download,
  User,
  Clock,
  AlertCircle,
  ExternalLink,
  BarChart3,
} from "lucide-react";

export default function AdminInfoDocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [viewStats, setViewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchDocumentAndStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch document details and view stats in parallel
      const [documentResponse, statsResponse] = await Promise.allSettled([
        infoApi.getInfoDocumentById(id),
        infoApi.getPopularInfoDocuments(),
      ]);

      if (documentResponse.status === "fulfilled") {
        setDocument(documentResponse.value);
      } else {
        setError("Document not found");
        return;
      }

      if (statsResponse.status === "fulfilled") {
        setViewStats(statsResponse.value.data);
      } else {
        console.warn("Could not fetch view stats:", statsResponse.reason);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setError(error.message || "Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDocumentAndStats();
    }
  }, [id, fetchDocumentAndStats]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getFileTypeDisplay = (fileType) => {
    if (fileType?.includes("pdf")) return "PDF Document";
    if (fileType?.includes("word") || fileType?.includes("document"))
      return "Word Document";
    if (fileType?.includes("powerpoint") || fileType?.includes("presentation"))
      return "PowerPoint Presentation";
    if (fileType?.includes("excel") || fileType?.includes("spreadsheet"))
      return "Excel Spreadsheet";
    if (fileType?.includes("csv")) return "CSV File";
    if (fileType?.includes("text")) return "Text Document";
    return "Document";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-32"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-1/4"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Document Not Found
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/admin/info")}
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center bg-fuchsia-50 text-gray-800 hover:text-fuchsia-800 rounded-md hover:bg-fuchsia-100 transition-colors group w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Documents
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => window.open(document.info_doc, "_blank")}
              className="inline-flex items-center justify-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Download
            </button>
            <button
              onClick={() => window.open(document.info_doc, "_blank")}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              View Document
            </button>
          </div>
        </div>

        {/* Document Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-3xl">
                {getFileIcon(document.file_type)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0 leading-tight">
                  {document.title}
                </h1>
                <div className="flex items-center space-x-2 sm:ml-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      document.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {document.status === "published" ? "Published" : "Archived"}
                  </span>
                </div>
              </div>

              {document.description && (
                <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
                  {document.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                  <User className="w-4 h-4 mr-2 text-fuchsia-500" />
                  <span className="font-medium">
                    {document.owner?.username || "Admin"}
                  </span>
                </div>

                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                  <Eye className="w-4 h-4 mr-2 text-fuchsia-500" />
                  <span className="font-medium">
                    {document.views?.count || 0}
                  </span>
                  <span className="ml-1">views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-fuchsia-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              File Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-2 h-2 bg-fuchsia-500 rounded-full mr-2"></span>
                File Details
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-sm text-gray-600 font-medium">
                    Original Name:
                  </span>
                  <span className="text-sm text-gray-900 font-medium mt-1 sm:mt-0 truncate sm:max-w-xs">
                    {document.original_filename}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-sm text-gray-600 font-medium">
                    File Type:
                  </span>
                  <span className="text-sm text-gray-900 font-medium mt-1 sm:mt-0">
                    {getFileTypeDisplay(document.file_type)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-sm text-gray-600 font-medium">
                    File Size:
                  </span>
                  <span className="text-sm text-gray-900 font-medium mt-1 sm:mt-0">
                    {formatFileSize(document.file_size)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-sm text-gray-600 font-medium">
                    Status:
                  </span>
                  <span
                    className={`text-sm font-medium mt-1 sm:mt-0 ${
                      document.status === "published"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {document.status === "published" ? "Published" : "Archived"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className="w-2 h-2 bg-fuchsia-500 rounded-full mr-2"></span>
                Timestamps
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-sm text-gray-600 font-medium">
                    Created:
                  </span>
                  <span className="text-sm text-gray-900 font-medium mt-1 sm:mt-0">
                    {formatDate(document.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="text-sm text-gray-600 font-medium">
                    Updated:
                  </span>
                  <span className="text-sm text-gray-900 font-medium mt-1 sm:mt-0">
                    {formatDate(document.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
