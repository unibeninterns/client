"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  Eye,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { withAdminAuth } from "@/lib/auth";
import { articlesApi, researchersApi, articleViewsApi } from "@/lib/api";

function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalArticles: 0,
    totalResearchers: 0,
    totalViews: 0,
    categoryCounts: {
      Research: 0,
      Innovation: 0,
      Development: 0,
    },
    loading: true,
  });

  const [recentArticles, setRecentArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const dashboardData = await articlesApi.getDashboardData();
        const researchers = await researchersApi.getResearchers();
        const popularArticle = await articleViewsApi.getPopularArticles(5);
        const popularArticles = popularArticle.data;
        console.log("Popular Articles:", popularArticles.data);

        const researchersCount = researchers?.data?.length || 0;

        let totalViews = 0;
        if (dashboardData.recent_articles) {
          dashboardData.recent_articles.forEach((article) => {
            if (article.views && article.views.count) {
              totalViews += article.views.count;
            }
          });
        }

        setStats({
          totalArticles: dashboardData.recent_articles?.length || 0,
          totalResearchers: researchersCount,
          totalViews: totalViews,
          categoryCounts: dashboardData.category_counts || {
            Research: 0,
            Innovation: 0,
            Development: 0,
          },
          loading: false,
        });

        const formattedArticles =
          dashboardData.recent_articles?.map((article) => ({
            id: article._id,
            title: article.title,
            category: article.category,
            views: article.views?.count || 0,
            date: new Date(article.publish_date).toISOString().split("T")[0],
          })) || [];

        setRecentArticles(formattedArticles);

        if (
          popularArticles &&
          popularArticles.data &&
          Array.isArray(popularArticles.data)
        ) {
          const formattedPopular = popularArticles.data.map((article) => ({
            id: article._id,
            title: article.title,
            category: article.category,
            views: article.views?.count || 0,
            date: new Date(article.publish_date).toISOString().split("T")[0],
          }));

          setPopularArticles(formattedPopular);
        } else {
          setPopularArticles([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-fuchsia-100 border-t-fuchsia-500"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 bg-fuchsia-50"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-red-700 mb-4 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your research
            portal.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:-translate-y-1"
          onClick={() => router.push("/admin/articles")}
        >
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">
                Total Articles
              </p>
              <h3 className="text-3xl font-bold text-blue-900">
                {stats.totalArticles}
              </h3>
            </div>
            <div className="p-3 bg-blue-200 rounded-full group-hover:bg-blue-300 transition-colors">
              <FileText className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 hover:-translate-y-1"
          onClick={() => router.push("/admin/researchers")}
        >
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700">Researchers</p>
              <h3 className="text-3xl font-bold text-green-900">
                {stats.totalResearchers}
              </h3>
            </div>
            <div className="p-3 bg-green-200 rounded-full group-hover:bg-green-300 transition-colors">
              <Users className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 hover:-translate-y-1">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-700">Total Views</p>
              <h3 className="text-3xl font-bold text-amber-900">
                {stats.totalViews.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-amber-200 rounded-full group-hover:bg-amber-300 transition-colors">
              <Eye className="h-6 w-6 text-amber-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 hover:from-fuchsia-100 hover:to-fuchsia-200 hover:-translate-y-1">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-fuchsia-700">
                Research Articles
              </p>
              <h3 className="text-3xl font-bold text-fuchsia-900">
                {stats.categoryCounts.Research}
              </h3>
            </div>
            <div className="p-3 bg-fuchsia-200 rounded-full group-hover:bg-fuchsia-300 transition-colors">
              <MessageSquare className="h-6 w-6 text-fuchsia-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="h-5 w-5 text-fuchsia-600" />
              Recent Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentArticles.length > 0 ? (
                      recentArticles.map((article, index) => (
                        <tr
                          key={article.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-fuchsia-600 font-semibold text-sm">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {article.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {article.date}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-800">
                              {article.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {article.views}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No articles found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Articles */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="h-5 w-5 text-fuchsia-600" />
              Popular Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {popularArticles.length > 0 ? (
                      popularArticles.map((article, index) => (
                        <tr
                          key={article.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-amber-600 font-semibold text-sm">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {article.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {article.date}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              {article.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <TrendingUp className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {article.views}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No popular articles found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5 text-fuchsia-600" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(stats.categoryCounts).map(([category, count]) => (
              <div key={category} className="text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-100 to-fuchsia-200"></div>
                  <div className="relative z-10">
                    <span className="text-2xl font-bold text-fuchsia-700">
                      {count}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {category}
                </h3>
                <p className="text-sm text-gray-600">Articles</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAdminAuth(AdminDashboardPage);
