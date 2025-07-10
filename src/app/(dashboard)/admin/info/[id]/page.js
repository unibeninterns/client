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
        setViewStats(statsResponse.value);
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
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.open(document.info_doc, "_blank")}
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={() => window.open(document.info_doc, "_blank")}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Document
            </button>
          </div>
        </div>

        {/* Document Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-fuchsia-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">
                {getFileIcon(document.file_type)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {document.title}
              </h1>

              {document.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {document.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Published {formatDate(document.publish_date)}</span>
                </div>

                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{document.owner?.username || "Admin"}</span>
                </div>

                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{document.views?.count || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            File Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                File Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Name:</span>
                  <span className="text-gray-900 font-medium">
                    {document.original_filename}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900 font-medium">
                    {getFileTypeDisplay(document.file_type)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="text-gray-900 font-medium">
                    {formatFileSize(document.file_size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
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

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Timestamps
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(document.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(document.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Statistics */}
        {viewStats && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                View Statistics
              </h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-fuchsia-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-fuchsia-600">
                      Total Views
                    </p>
                    <p className="text-2xl font-bold text-fuchsia-900">
                      {viewStats.totalViews}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-fuchsia-600" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Recent Views
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {viewStats.dailyStats?.reduce(
                        (sum, day) => sum + day.count,
                        0
                      ) || 0}
                    </p>
                    <p className="text-xs text-blue-600">Last 30 days</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Peak Day
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.max(
                        ...(viewStats.dailyStats?.map((day) => day.count) || [
                          0,
                        ])
                      )}
                    </p>
                    <p className="text-xs text-green-600">views</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Daily Views Chart */}
            {viewStats.dailyStats && viewStats.dailyStats.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Daily Views (Last 30 Days)
                </h3>
                <div className="h-32 flex items-end space-x-1">
                  {viewStats.dailyStats.map((day, index) => {
                    const maxViews = Math.max(
                      ...viewStats.dailyStats.map((d) => d.count)
                    );
                    const height =
                      maxViews > 0 ? (day.count / maxViews) * 100 : 0;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-fuchsia-200 rounded-t hover:bg-fuchsia-300 transition-colors"
                          style={{ height: `${height}%` }}
                          title={`${day.date}: ${day.count} views`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
