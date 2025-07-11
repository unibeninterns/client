"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  Eye,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Calendar,
  BarChart4,
  BarChart2,
  Link as LinkIcon,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { withResearcherAuth } from "@/lib/auth";
import { researcherDashboardApi } from "@/lib/api";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

function ResearcherDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    profile: null,
    articles: [],
    collaborators: [],
    stats: {
      total_articles: 0,
      sole_author: 0,
      collaborations: 0,
    },
  });
  const [popularArticles, setPopularArticles] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    totalViews: 0,
    mostViewed: null,
    articlesByMonth: [],
    categoriesDistribution: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearcherData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch researcher profile data (includes articles and collaborators)
        const profileResponse = await researcherDashboardApi.getProfile();

        // Fetch popular articles
        const popularResponse =
          await researcherDashboardApi.getPopularArticles(3);

        // Fetch analytics data
        const analyticsResponse = await researcherDashboardApi.getAnalytics();

        // Set state with fetched data
        if (profileResponse?.data) {
          setProfileData(profileResponse.data);
        }

        if (popularResponse?.data) {
          setPopularArticles(popularResponse.data);
        }

        if (analyticsResponse?.data) {
          setAnalytics(analyticsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching researcher data:", error);
        setError("Failed to load researcher data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearcherData();
  }, []);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
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

  const { profile, articles, collaborators, stats } = profileData;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight">
        Researcher Dashboard
      </h1>

      {/* Researcher Profile Summary */}
      {profile && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-3/4">
            <Card className="border-fuchsia-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 border-b border-fuchsia-200">
                <CardTitle className="text-fuchsia-900">
                  Research Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Articles</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.total_articles || 0}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Collaborations</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.collaborations || 0}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                      <Eye className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {analytics.totalViews || 0}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-fuchsia-50">
                  <Button
                    variant="outline"
                    asChild
                    className="hover:bg-fuchsia-50 hover:border-fuchsia-200"
                  >
                    <Link href="/researcher/analytics">
                      <BarChart2 className="h-4 w-4 mr-2" /> View Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Published Articles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Published Articles</h2>
          <div className="text-sm text-gray-500">
            {articles?.length || 0} articles published
          </div>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article) => (
              <Link
                href={`/article/${article._id}`}
                key={article._id}
                className="group bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-fuchsia-100 hover:border-fuchsia-200"
              >
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 bg-fuchsia-900 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      <BookOpen size={12} className="mr-1" />
                      {article.category}
                    </span>
                  </div>
                  {article.cover_photo ? (
                    <Image
                      src={getImageUrl(article.cover_photo)}
                      alt={article.title}
                      width={400}
                      height={240}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center">
                      <FileText size={48} className="text-fuchsia-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-fuchsia-900 mb-3 line-clamp-2 group-hover:text-fuchsia-700 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>

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
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No published articles found.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Articles will appear here once published.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Most Popular Articles */}
      <div className="space-y-4">
        <Card className="shadow-lg border-fuchsia-100">
          <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 border-b border-fuchsia-200">
            <CardTitle className="text-fuchsia-900">
              My Popular Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Published
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles && articles.length > 0 ? (
                    articles
                      .sort(
                        (a, b) => (b.views?.count || 0) - (a.views?.count || 0)
                      )
                      .slice(0, 5)
                      .map((article, index) => (
                        <tr
                          key={article._id}
                          className="hover:bg-fuchsia-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">
                                  {article.title}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {article.summary}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs rounded-full">
                              {article.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {article.views?.count || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(
                              article.publish_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/article/${article._id}`}
                              className="inline-flex items-center gap-1 text-fuchsia-600 hover:text-fuchsia-900 hover:bg-fuchsia-100 font-medium transition-colors"
                            >
                              <LinkIcon className="h-4 w-4" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        No articles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collaborators */}
      {collaborators && collaborators.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Collaborators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collaborators.map((collaborator) => (
              <Card key={collaborator._id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      {collaborator.profilePicture ? (
                        <Image
                          src={getImageUrl(collaborator.profilePicture)}
                          alt={collaborator.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">
                        {collaborator.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {collaborator.title || "Researcher"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {analytics.categoriesDistribution &&
        analytics.categoriesDistribution.length > 0 && (
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <BarChart3 className="h-5 w-5 text-fuchsia-600" />
                My Research Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.categoriesDistribution.map((category) => (
                  <div key={category._id} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-100 to-fuchsia-200"></div>
                      <div className="relative z-10">
                        <span className="text-2xl font-bold text-fuchsia-700">
                          {category.count}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category._id}
                    </h3>
                    <p className="text-sm text-gray-600">Articles</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

export default withResearcherAuth(ResearcherDashboard);
