"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Share2,
  ArrowLeft,
  Clock,
  Calendar,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { articlesApi, articleViewsApi, facultyApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

const ArticlePage = () => {
  const params = useParams();
  const articleId = params?.id;
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularArticles, setPopularArticles] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [shareClicked, setShareClicked] = useState(false);

  // Add share functionality
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setShareClicked(true);
      setTimeout(() => setShareClicked(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Helper function for reading time
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    if (!articleId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const articleData = await articlesApi.getPublicArticle(articleId);
        console.log("Article data:", articleData);
        if (!articleData) {
          setError("Article not found");
          setLoading(false);
          return;
        }

        setArticle(articleData);

        // Record a view for this article
        try {
          await articleViewsApi.recordView(articleId);
        } catch (viewError) {
          console.error("Error recording view:", viewError);
          // Don't fail the whole page if view recording fails
        }

        // Fetch popular articles
        try {
          const popular = await articleViewsApi.getPopularArticles(4);
          if (popular && popular.data && Array.isArray(popular.data.data)) {
            setPopularArticles(popular.data.data);
          } else {
            console.error(
              "Popular articles response is not an array:",
              popular
            );
            setPopularArticles([]);
          }
        } catch (popularError) {
          console.error("Error fetching popular articles:", popularError);
          setPopularArticles([]);
        }

        if (articleData.faculty) {
          try {
            const response = await facultyApi.getFacultyById(
              articleData.faculty
            );
            if (response && response.data) {
              setFaculty(response.data);
            } else {
              console.error("Faculty response is invalid:", response);
              setFaculty(null);
            }
          } catch (facultyError) {
            console.error("Error fetching faculty:", facultyError);
            setFaculty(null);
          }
        }

        // Fetch articles with the same category for related articles
        try {
          if (articleData && articleData.category) {
            const allArticles = await articlesApi.getPublicArticles({
              category: articleData.category,
            });
            if (Array.isArray(allArticles)) {
              const related = allArticles
                .filter((art) => art._id !== articleId)
                .slice(0, 3);
              setRelatedArticles(related);
            } else {
              console.error(
                "Related articles response is not an array:",
                allArticles
              );
              setRelatedArticles([]);
            }
          }
        } catch (relatedError) {
          console.error("Error fetching related articles:", relatedError);
          setRelatedArticles([]);
        }
      } catch (err) {
        console.error("Error fetching article data:", err);
        setError(
          "Failed to load article. It may have been removed or you don't have permission to view it."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  if (!articleId) return <div className="p-8">Invalid article ID</div>;
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Article not found"}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-fuchsia-900 text-white rounded hover:bg-fuchsia-800 transition flex items-center gap-2"
          >
            <span>← Back</span>
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="py-8 px-4 md:px-8 lg:px-20 max-w-7xl mx-auto">
        {/* Improved Navigation with Share */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 text-fuchsia-700 hover:bg-fuchsia-100 transition-colors relative"
          >
            {shareClicked ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </Button>
        </div>

        {/* Improved Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fuchsia-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Improved Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <Link
                href={`/${article.category ? article.category.toLowerCase() : ""}`}
                className="font-semibold hover:text-fuchsia-600 transition-colors"
              >
                {article.category || "Uncategorized"}
              </Link>
            </div>
            {article.department && article.department.title && (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-fuchsia-800">
                  {article.department.title}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publish_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {calculateReadingTime(article.content || "")} min read
              </span>
            </div>
          </div>
        </div>

        {/* Improved Cover Photo */}
        {article.cover_photo && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={getImageUrl(article.cover_photo)}
              alt="Cover Photo"
              width={1200}
              height={500}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              priority
            />
          </div>
        )}

        {/* Improved Layout - Better Mobile Responsiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Takes more space on desktop */}
          <div className="lg:col-span-3 order-1">
            <article className="prose prose-lg max-w-none prose-headings:text-fuchsia-900 prose-links:text-fuchsia-600 prose-strong:text-fuchsia-800">
              <div
                dangerouslySetInnerHTML={{
                  __html: article.content
                    ? article.content.replace(/\n/g, "<br/>")
                    : "",
                }}
              />
            </article>

            {/* Contributors Section */}
            {article.contributors && article.contributors.length > 0 && (
              <div className="mt-8 p-4 bg-fuchsia-50 rounded-xl border border-fuchsia-100">
                <h3 className="font-semibold text-fuchsia-900 mb-2">
                  Contributors
                </h3>
                <p className="text-sm text-gray-700">
                  {article.contributors
                    .map((c) => c.name || c.username)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Related Articles - Better Mobile Layout */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl sm:text-2xl font-bold text-fuchsia-900 mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link
                      href={`/articles/${rel._id}`}
                      key={rel._id}
                      className="group bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-fuchsia-100 hover:border-fuchsia-200"
                    >
                      <div className="relative">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center px-3 py-1 bg-fuchsia-900 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                            <BookOpen size={12} className="mr-1" />
                            {rel.category}
                          </span>
                        </div>
                        {rel.cover_photo ? (
                          <Image
                            src={getImageUrl(rel.cover_photo)}
                            alt={rel.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center">
                            <BookOpen size={48} className="text-fuchsia-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-fuchsia-900 group-hover:text-fuchsia-700 transition-colors line-clamp-2">
                          {rel.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-4 mt-2 mb-3">
                          {rel.summary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Better Mobile Positioning */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-fuchsia-100 p-6">
                <h2 className="text-lg font-bold text-fuchsia-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Popular Articles
                </h2>

                {popularArticles.length > 0 ? (
                  <div className="space-y-4">
                    {popularArticles.map((top, index) => (
                      <Link
                        href={`/articles/${top._id}`}
                        key={top._id}
                        className="group block p-3 rounded-xl hover:bg-fuchsia-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-fuchsia-900 group-hover:text-fuchsia-700 line-clamp-2">
                              {top.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No popular articles found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticlePage;
