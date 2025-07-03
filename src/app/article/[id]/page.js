"use client";

import { useState, useEffect } from "react";
import { articlesApi, articleViewsApi, facultyApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
  Eye,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingTime, setReadingTime] = useState(0);

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await articlesApi.getArticle(id);
        setArticle(articleData);

        // Calculate reading time
        if (articleData.content) {
          setReadingTime(calculateReadingTime(articleData.content));
        }

        // Record a view for this article
        await articleViewsApi.recordView(id);

        if (articleData.faculty) {
          try {
            const response = await facultyApi.getFacultyById(
              articleData.faculty
            );
            if (response && response.data) {
              setFaculty(response.data);
            }
          } catch (facultyError) {
            console.error("Error fetching faculty:", facultyError);
            setFaculty(null);
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          "Failed to load article. It may have been removed or you don't have permission to view it."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-fuchsia-50 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
          <p className="text-fuchsia-700 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Alert
            variant="destructive"
            className="mb-6 border-red-200 bg-red-50"
          >
            <AlertDescription className="text-red-700">
              {error || "Article not found"}
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-fuchsia-900 leading-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
              <User className="h-4 w-4 mr-2 text-fuchsia-600" />
              <span className="font-medium">
                {article.owner?.username || "Anonymous"}
              </span>
            </div>

            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
              <Calendar className="h-4 w-4 mr-2 text-fuchsia-600" />
              <span>{new Date(article.publish_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
              <Eye className="h-4 w-4 mr-2 text-fuchsia-600" />
              <span>{article.views?.count || 0} views</span>
            </div>

            {readingTime > 0 && (
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                <Clock className="h-4 w-4 mr-2 text-fuchsia-600" />
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Category and Department Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href={`/${article.category.toLowerCase()}`}
              className="inline-flex items-center px-4 py-2 bg-fuchsia-900 text-white text-sm font-semibold rounded-full hover:bg-fuchsia-800 transition-colors duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {article.category}
            </Link>

            {article.department && (
              <span className="inline-flex items-center px-4 py-2 bg-fuchsia-100 text-fuchsia-800 text-sm font-medium rounded-full">
                {article.department.title}
              </span>
            )}

            {article.faculty && (
              <span className="inline-flex items-center px-4 py-2 bg-fuchsia-50 text-fuchsia-700 text-sm font-medium rounded-full">
                {faculty?.title || "Faculty: N/A"}
              </span>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {article.cover_photo && (
          <div className="mb-8 sm:mb-12">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
              <Image
                src={getImageUrl(article.cover_photo)}
                alt={`Cover image for ${article.title}`}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 hover:scale-105"
                width={1200}
                height={500}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <div className="prose prose-lg max-w-none prose-headings:text-fuchsia-900 prose-links:text-fuchsia-600 prose-strong:text-fuchsia-800">
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        </div>

        {/* Contributors Section */}
        {article.contributors && article.contributors.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-fuchsia-900 mb-6 flex items-center">
              <User className="h-6 w-6 mr-3" />
              Contributors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {article.contributors.map((contributor) => (
                <div
                  key={contributor._id}
                  className="flex items-center p-4 sm:p-5 border border-fuchsia-100 rounded-xl hover:bg-fuchsia-50 transition-colors duration-200"
                >
                  {contributor.profile_image ? (
                    <Image
                      src={getImageUrl(contributor.profile_image)}
                      alt={contributor.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-4 object-cover ring-2 ring-fuchsia-200"
                      width={56}
                      height={56}
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-fuchsia-200 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-fuchsia-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-fuchsia-900 truncate">
                      {contributor.name || contributor.username}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {contributor.email}
                    </p>
                    {contributor.bio && (
                      <p className="text-sm mt-1 text-gray-700 line-clamp-2">
                        {contributor.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
