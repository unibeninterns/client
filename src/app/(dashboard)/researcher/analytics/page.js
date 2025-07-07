"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withResearcherAuth } from "@/lib/auth";
import { researcherDashboardApi } from "@/lib/api";
import {
  RefreshCw,
  TrendingUp,
  BarChart2,
  Calendar,
  Eye,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  FileText,
} from "lucide-react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

function ResearcherAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    totalViews: 0,
    mostViewed: null,
    articlesByMonth: [],
    categoriesDistribution: [],
    viewsOverTime: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("year");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = useCallback(
    async (selectedTimeFrame = timeFrame) => {
      try {
        setIsLoading(!isRefreshing);
        setError(null);
        const response =
          await researcherDashboardApi.getAnalytics(selectedTimeFrame);
        if (response?.data) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [timeFrame, setIsLoading, setError, setAnalytics, isRefreshing]
  );

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
    setIsRefreshing(true);
    fetchAnalytics(newTimeFrame);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalytics();
  };

  // Process the articlesByMonth data to have proper format for charts
  const processArticlesByMonth = () => {
    if (!analytics.articlesByMonth || analytics.articlesByMonth.length === 0) {
      return [];
    }

    return analytics.articlesByMonth.map((item) => {
      const monthName = new Date(0, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" }
      );
      return {
        name: `${monthName} ${item._id.year}`,
        articles: item.count,
      };
    });
  };

  // Colors for charts
  const COLORS = [
    "#93c5fd", // blue-300
    "#86efac", // green-300
    "#fde047", // yellow-300
    "#fca5a5", // red-300
    "#d8b4fe", // purple-300
    "#f9a8d4", // pink-300
    "#fdba74", // orange-300
  ];

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fuchsia-100 rounded-full mb-4">
            <Activity className="h-8 w-8 text-fuchsia-600 animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-fuchsia-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Failed to load data</h3>
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process categoryDistribution for the chart
  const categoryData =
    analytics.categoriesDistribution?.length > 0
      ? analytics.categoriesDistribution.map((cat) => ({
          name: cat._id,
          articles: cat.count,
        }))
      : [];

  // For articles by month/views over time
  const timeData = processArticlesByMonth();

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-fuchsia-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fuchsia-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your research impact and publication metrics
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">
                  Total Articles
                </p>
                <h3 className="text-3xl font-bold text-blue-900">
                  {analytics.totalArticles || 0}
                </h3>
              </div>
              <div className="p-3 bg-blue-200 rounded-full group-hover:bg-blue-300 transition-colors">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium">
                  Total Views
                </p>
                <h3 className="text-3xl font-bold text-emerald-900">
                  {analytics.totalViews || 0}
                </h3>
              </div>
              <div className="p-3 bg-emerald-200 rounded-full group-hover:bg-emerald-300 transition-colors">
                <Eye className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 text-sm font-medium">
                  Avg Views per Article
                </p>
                <h3 className="text-3xl font-bold text-amber-900">
                  {analytics.totalArticles
                    ? Math.round(analytics.totalViews / analytics.totalArticles)
                    : 0}
                </h3>
              </div>
              <div className="p-3 bg-amber-200 rounded-full group-hover:bg-amber-300 transition-colors">
                <TrendingUp className="h-6 w-6 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-t-lg">
            <CardTitle className="text-xl text-fuchsia-900">
              Articles by Category
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Distribution of your research topics
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              {categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="p-4 bg-fuchsia-50 rounded-full mb-4">
                    <BarChart2 className="h-12 w-12 text-fuchsia-300" />
                  </div>
                  <p className="text-lg font-medium">
                    No category data available
                  </p>
                  <p className="text-sm text-center max-w-md">
                    Data will appear as you categorize your articles
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="articles"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Viewed Article */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-xl text-fuchsia-900">
              Most Viewed Article
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Your top performing research
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {analytics.mostViewed ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2 text-fuchsia-900 line-clamp-2">
                    {analytics.mostViewed.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center bg-white px-3 py-1 rounded-full">
                      <Eye className="h-4 w-4 mr-1 text-emerald-500" />
                      {analytics.mostViewed.views.count || 0} views
                    </span>
                    <span className="flex items-center bg-white px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                      {new Date(
                        analytics.mostViewed.publish_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-all duration-200"
                  >
                    <Link href={`/article/${analytics.mostViewed._id}`}>
                      View Article
                      <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <div className="p-4 bg-fuchsia-50 rounded-full mb-4">
                  <TrendingUp className="h-12 w-12 text-fuchsia-300" />
                </div>
                <p className="text-lg font-medium">No articles yet</p>
                <p className="text-sm text-center">
                  Publish your first article to see analytics
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Articles By Month Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0">
        <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-t-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-fuchsia-900">
                Articles Published Over Time
              </CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                Track your publication frequency
              </p>
            </div>
            <div className="flex space-x-1 rounded-lg bg-white shadow-sm p-1 border">
              {[
                { key: "week", label: "7 Days" },
                { key: "month", label: "30 Days" },
                { key: "year", label: "12 Months" },
              ].map((period) => (
                <button
                  key={period.key}
                  onClick={() => handleTimeFrameChange(period.key)}
                  disabled={isRefreshing}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    timeFrame === period.key
                      ? "bg-fuchsia-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-fuchsia-700 hover:bg-fuchsia-50"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            {timeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="p-4 bg-fuchsia-50 rounded-full mb-4">
                  <Calendar className="h-12 w-12 text-fuchsia-300" />
                </div>
                <p className="text-lg font-medium">No article data available</p>
                <p className="text-sm text-center max-w-md">
                  Data will appear as you publish articles. Start creating your
                  first research article!
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="articles"
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#C026D3" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withResearcherAuth(ResearcherAnalyticsPage);
