"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { researcherDashboardApi } from "@/lib/api";
import { withResearcherAuth } from "@/lib/auth";
import {
  FileText,
  RefreshCw,
  Calendar,
  Eye,
  Filter,
  Search,
  Tag,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function ResearcherArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await researcherDashboardApi.getProfile();
        if (response?.data?.articles) {
          setArticles(response.data.articles);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(
              response.data.articles.map((article) => article.category)
            ),
          ].filter(Boolean);

          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on search term and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "" || article.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-72 animate-pulse"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-12 bg-gray-200 rounded-lg flex-grow animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
            >
              <div className="h-48 sm:h-56 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // More helpful error messages
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Failed to load data</h3>
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Articles
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage and track your published research articles
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input with improved styling */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by title, summary, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 h-12 text-base border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-500 rounded-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Filter with improved styling */}
            <div className="relative min-w-[200px]">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-base appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterCategory) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 text-sm rounded-full">
                  Search: &quot;{searchTerm}&quot;
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-fuchsia-900 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 text-sm rounded-full">
                  Category: {filterCategory}
                  <button
                    onClick={() => setFilterCategory("")}
                    className="hover:text-fuchsia-900 transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <Link
              href={`/article/${article._id}`}
              key={article._id}
              className="group bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-fuchsia-100 hover:border-fuchsia-200"
            >
              <div className="relative">
                {/* Category Badge */}
                {article.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 bg-fuchsia-900 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      <Tag size={12} className="mr-1" />
                      {article.category}
                    </span>
                  </div>
                )}

                {/* Article Image */}
                {article.cover_photo ? (
                  <div className="relative overflow-hidden">
                    <Image
                      src={getImageUrl(article.cover_photo)}
                      alt={article.title}
                      width={400}
                      height={240}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center">
                    <FileText size={48} className="text-fuchsia-400" />
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Article Title */}
                <h3 className="text-lg font-bold text-fuchsia-900 mb-3 line-clamp-2 group-hover:text-fuchsia-700 transition-colors">
                  {article.title}
                </h3>

                {/* Article Summary */}
                {article.summary && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                )}

                {/* Department Badge */}
                {article.department?.title && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs rounded-full">
                      {article.department.title}
                    </span>
                  </div>
                )}

                {/* Article Meta */}
                <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-fuchsia-50">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>
                      {new Date(article.publish_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{article.views?.count || 0} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Enhanced Empty State
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 bg-fuchsia-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-fuchsia-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterCategory
              ? "No articles found"
              : "No articles yet"}
          </h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            {searchTerm || filterCategory
              ? "Try adjusting your search terms or filters to find what you're looking for."
              : "You haven't published any articles yet. Start creating your first research article to see it here."}
          </p>
          {(searchTerm || filterCategory) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("");
              }}
              className="border-fuchsia-300 text-fuchsia-700 hover:bg-fuchsia-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default withResearcherAuth(ResearcherArticlesPage);
