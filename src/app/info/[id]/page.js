"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { infoApi } from "@/lib/api";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  FileText,
  Calendar,
  Download,
  ArrowLeft,
  ExternalLink,
  User,
  Clock,
  Share2,
  BookOpen,
  CheckCircle,
} from "lucide-react";

export default function InfoDocumentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewRecorded, setViewRecorded] = useState(false);
  const [downloadClicked, setDownloadClicked] = useState(false);

  const fetchDocument = useCallback(async () => {
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
  }, [id, viewRecorded]);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id, fetchDocument]);

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

  const handleDownload = () => {
    setDownloadClicked(true);
    setTimeout(() => setDownloadClicked(false), 2000);
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-8">
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
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Document not found
              </h3>
              <p className="text-gray-600 mb-8">
                The document you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <button
                onClick={() => router.push("/info")}
                className="inline-flex items-center px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors font-medium"
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Back Button */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/info")}
              className="inline-flex items-center text-gray-600 hover:text-fuchsia-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Documents</span>
            </button>
          </div>

          {/* Enhanced Document Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 text-white p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/30 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm">
                      {getFileIcon(document.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/30 text-white mb-2">
                        {getFileTypeName(document.file_type)}
                      </span>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                        {document.title}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-fuchsia-50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(document.publish_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">
                        {formatFileSize(document.file_size)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Content */}
            <div className="p-6 sm:p-8">
              {/* Description */}
              {document.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-fuchsia-600" />
                    About this document
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {document.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Document Actions */}
              <div className="bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 rounded-xl p-6 sm:p-8 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Ready to access the document?
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                    <a
                      href={document.info_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors font-medium shadow"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View Document
                    </a>
                    <a
                      href={document.info_doc}
                      download={document.original_filename}
                      onClick={handleDownload}
                      className={`inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow relative ${
                        downloadClicked ? "opacity-70 pointer-events-none" : ""
                      }`}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {downloadClicked ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2 text-green-400 animate-bounce" />
                          Downloaded!
                        </>
                      ) : (
                        "Download"
                      )}
                    </a>
                  </div>
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
