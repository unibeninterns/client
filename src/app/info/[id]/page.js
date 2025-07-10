"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { infoApi } from "@/lib/api";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  FileText,
  Calendar,
  Eye,
  Download,
  ArrowLeft,
  ExternalLink,
  User,
  Clock,
} from "lucide-react";

export default function InfoDocumentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewRecorded, setViewRecorded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await infoApi.getInfoDocumentById(id);
      setDocument(response);

      // Record view after successful fetch
      if (!viewRecorded) {
        try {
          await infoApi.recordView(id);
          setViewRecorded(true);
        } catch (viewError) {
          console.warn("Could not record view:", viewError);
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setError(error.message || "Failed to fetch document");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const getFileTypeName = (fileType) => {
    if (fileType?.includes("pdf")) return "PDF Document";
    if (fileType?.includes("word") || fileType?.includes("document"))
      return "Word Document";
    if (fileType?.includes("powerpoint") || fileType?.includes("presentation"))
      return "PowerPoint Presentation";
    if (fileType?.includes("excel") || fileType?.includes("spreadsheet"))
      return "Excel Spreadsheet";
    if (fileType?.includes("csv")) return "CSV File";
    return "Document";
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Document not found
              </h3>
              <p className="text-gray-600 mb-6">
                The document you're looking for doesn't exist or has been
                removed.
              </p>
              <button
                onClick={() => router.push("/info")}
                className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documents
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/info")}
            className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </button>

          {/* Document Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="text-3xl mr-3">
                      {getFileIcon(document.file_type)}
                    </div>
                    <span className="text-fuchsia-100 text-sm font-medium">
                      {getFileTypeName(document.file_type)}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {document.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-fuchsia-100 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(document.publish_date)}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {document.views?.count || 0} views
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {formatFileSize(document.file_size)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Description */}
              {document.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {document.description}
                  </p>
                </div>
              )}

              {/* Document Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Ready to view the document?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Click the button below to open the document in a new tab.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={document.info_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Document
                    </a>

                    <a
                      href={document.info_doc}
                      download={document.original_filename}
                      className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Original Filename
                    </span>
                  </div>
                  <p
                    className="text-gray-900 text-sm truncate"
                    title={document.original_filename}
                  >
                    {document.original_filename}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Uploaded</span>
                  </div>
                  <p className="text-gray-900 text-sm">
                    {formatDate(document.createdAt || document.publish_date)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Uploaded by</span>
                  </div>
                  <p className="text-gray-900 text-sm">
                    {document.owner?.username || "Admin"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
