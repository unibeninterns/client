"use client";

import { useState, useEffect } from "react";
import { withAdminAuth } from "@/lib/auth";
import {
  articlesApi,
  facultyApi,
  departmentApi,
  researchersApi,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  MessageSquare,
  Filter,
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  TrendingUp,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Image from "next/image";

function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "Research",
    faculty: "",
    department: "",
    contributors: [],
    cover_photo: null,
  });
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [researchers, setResearchers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // grid or table

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const articlesData = await articlesApi.getArticles();
        const researchersData = await researchersApi.getResearchers();
        const facultiesData = await facultyApi.getFaculties();
        const departmentsData = await departmentApi.getDepartments();

        setArticles(articlesData);
        setResearchers(researchersData.data);
        setFaculties(facultiesData.data);
        setDepartments(departmentsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate word count when content changes
  useEffect(() => {
    if (formData.content) {
      const words = formData.content.trim()
        ? formData.content.trim().split(/\s+/).length
        : 0;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [formData.content]);

  useEffect(() => {
    if (formData.summary) {
      const words = formData.summary.trim()
        ? formData.summary.trim().split(/\s+/).length
        : 0;
      setSummaryWordCount(words);
    } else {
      setSummaryWordCount(0);
    }
  }, [formData.summary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover_photo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFacultyChange = (value) => {
    setFormData((prev) => ({ ...prev, faculty: value, department: "" }));
  };

  const handleDepartmentChange = (value) => {
    setFormData((prev) => ({ ...prev, department: value }));
  };

  const handleContributorsChange = (value) => {
    setFormData((prev) => {
      // Check if contributors already includes this value
      if (prev.contributors.includes(value)) {
        return {
          ...prev,
          contributors: prev.contributors.filter((id) => id !== value),
        };
      } else {
        return {
          ...prev,
          contributors: [...prev.contributors, value],
        };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      category: "Research",
      faculty: "",
      department: "",
      contributors: [],
      cover_photo: null,
    });
    setCoverPhotoPreview(null);
    setWordCount(0);
    setSummaryWordCount(0);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate word count
    if (wordCount > 1000) {
      setError("Content exceeds the 1000 word limit");
      return;
    }

    if (summaryWordCount > 50) {
      setError("Summary exceeds the 50 word limit");
      return;
    }

    // Validate required fields
    if (
      !formData.title ||
      !formData.content ||
      !formData.summary ||
      !formData.faculty ||
      !formData.department
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.contributors.length === 0) {
      setError("Please select at least one contributor");
      return;
    }

    if (!formData.cover_photo) {
      setError("Please add a cover photo");
      return;
    }

    setIsSubmitting(true);

    try {
      const articleFormData = new FormData();
      articleFormData.append("title", formData.title);
      articleFormData.append("category", formData.category);
      articleFormData.append("content", formData.content);
      articleFormData.append("summary", formData.summary);
      articleFormData.append("faculty", formData.faculty);
      articleFormData.append("department", formData.department);

      if (formData.contributors && formData.contributors.length > 0) {
        formData.contributors.forEach((contributor) => {
          articleFormData.append("contributors[]", contributor);
        });
      }

      if (formData.cover_photo) {
        articleFormData.append("cover_photo", formData.cover_photo);
      }

      const response = await articlesApi.createArticle(articleFormData);
      setArticles((prevArticles) => [response, ...prevArticles]);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create article";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await articlesApi.deleteArticle(id);
        setArticles(articles.filter((article) => article._id !== id));
      } catch (error) {
        console.error("Error deleting article:", error);
        setError("Failed to delete article");
      }
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.contributors &&
        article.contributors.some(
          (contributor) =>
            contributor.name &&
            contributor.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCategory =
      categoryFilter === "all" || article.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const filteredDepartments = departments.filter(
    (dept) => !formData.faculty || dept.faculty === formData.faculty
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case "Research":
        return "bg-gradient-to-r from-fuchsia-100 to-purple-100 text-fuchsia-800 border-fuchsia-200";
      case "Innovation":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200";
      case "Development":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="relative">
          <RefreshCw className="h-8 w-8 animate-spin text-fuchsia-500" />
          <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-fuchsia-200 animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-500 animate-pulse">
          Loading articles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section with Enhanced Design */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-fuchsia-50 to-purple-50 p-6 rounded-xl border border-fuchsia-100">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
            Articles Management
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Create, manage, and organize research articles
          </p>
        </div>

        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-fuchsia-50">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                Add New Article
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Create a new research article to be published on the platform.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title*
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter article title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border-fuchsia-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="summary"
                    className="text-sm font-medium text-gray-700"
                  >
                    Summary* (50 words max)
                  </Label>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      summaryWordCount > 50
                        ? "bg-red-100 text-red-600"
                        : "bg-fuchsia-100 text-fuchsia-600"
                    }`}
                  >
                    {summaryWordCount}/50 words
                  </span>
                </div>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Enter a brief summary of the article"
                  value={formData.summary}
                  onChange={handleInputChange}
                  className="min-h-[100px] border-fuchsia-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category*
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="border-fuchsia-200 focus:border-fuchsia-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Innovation">Innovation</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contributors"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contributors*
                  </Label>
                  <div className="border border-fuchsia-200 rounded-md p-3 max-h-32 overflow-y-auto bg-white">
                    {researchers.map((researcher) => (
                      <div
                        key={researcher._id}
                        className="flex items-center space-x-2 py-1 hover:bg-fuchsia-50 px-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          id={`contributor-${researcher._id}`}
                          checked={formData.contributors.includes(
                            researcher._id
                          )}
                          onChange={() => {
                            const newContributors =
                              formData.contributors.includes(researcher._id)
                                ? formData.contributors.filter(
                                    (id) => id !== researcher._id
                                  )
                                : [...formData.contributors, researcher._id];
                            setFormData((prev) => ({
                              ...prev,
                              contributors: newContributors,
                            }));
                          }}
                          className="text-fuchsia-600 focus:ring-fuchsia-500"
                        />
                        <label
                          htmlFor={`contributor-${researcher._id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {researcher.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="faculty"
                    className="text-sm font-medium text-gray-700"
                  >
                    Faculty*
                  </Label>
                  <Select
                    value={formData.faculty}
                    onValueChange={handleFacultyChange}
                  >
                    <SelectTrigger className="border-fuchsia-200 focus:border-fuchsia-500">
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty._id} value={faculty.code}>
                          {faculty.title.length > 30
                            ? faculty.title.substring(0, 30) + "..."
                            : faculty.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="department"
                    className="text-sm font-medium text-gray-700"
                  >
                    Department*
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={handleDepartmentChange}
                    disabled={!formData.faculty}
                  >
                    <SelectTrigger className="border-fuchsia-200 focus:border-fuchsia-500 disabled:opacity-50">
                      <SelectValue
                        placeholder={
                          formData.faculty
                            ? "Select department"
                            : "Select faculty first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments.map((department) => (
                        <SelectItem
                          key={department._id}
                          value={department.code}
                        >
                          {department.title.length > 30
                            ? department.title.substring(0, 30) + "..."
                            : department.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cover_photo"
                  className="text-sm font-medium text-gray-700"
                >
                  Cover Photo*
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="cover_photo"
                    name="cover_photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover_photo"
                    className="cursor-pointer px-4 py-2 border border-fuchsia-200 rounded-md text-sm flex items-center hover:bg-fuchsia-50 transition-colors"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {formData.cover_photo ? "Change Image" : "Upload Image"}
                  </label>
                  {coverPhotoPreview && (
                    <div className="relative">
                      <Image
                        src={coverPhotoPreview}
                        alt="Cover preview"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg border border-fuchsia-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            cover_photo: null,
                          }));
                          setCoverPhotoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="content"
                    className="text-sm font-medium text-gray-700"
                  >
                    Content*
                  </Label>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      wordCount > 1000
                        ? "bg-red-100 text-red-600"
                        : "bg-fuchsia-100 text-fuchsia-600"
                    }`}
                  >
                    {wordCount}/1000 words
                  </span>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter article content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[200px] border-fuchsia-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
                  required
                />
              </div>

              <DialogFooter className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-r from-white to-fuchsia-50 border-t border-fuchsia-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  className="border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || wordCount > 1000 || summaryWordCount > 50
                  }
                  className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Article"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles by title or contributor..."
              className="pl-10 border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 border-gray-300 focus:border-fuchsia-500">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === "grid"
                    ? "bg-fuchsia-100 text-fuchsia-600"
                    : "text-gray-600 hover:text-fuchsia-600"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === "table"
                    ? "bg-fuchsia-100 text-fuchsia-600"
                    : "text-gray-600 hover:text-fuchsia-600"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No articles found</p>
              <p className="text-gray-400 text-sm">
                Create your first article to get started
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <Card
                key={article._id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-gray-200 hover:border-fuchsia-300 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-fuchsia-100 to-purple-100 relative overflow-hidden">
                    {article.cover_photo ? (
                      <Image
                        src={article.cover_photo}
                        alt={article.title}
                        width={640}
                        height={360}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="h-16 w-16 text-fuchsia-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}
                      >
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.publish_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {article.views ? article.views.count : 0}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {article.owner && article.owner.username}
                      </p>
                      {article.contributors &&
                        article.contributors.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {article.contributors.length} contributor(s)
                          </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/article/${article._id}`)}
                          className="text-fuchsia-600 hover:text-fuchsia-700 hover:bg-fuchsia-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/articles/edit/${article._id}`)
                          }
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteArticle(article._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Table View */
        <Card className="border-fuchsia-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Researcher
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Views
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-12 w-12 text-gray-300 mb-2" />
                          <p>No articles found</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Try changing your filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((article) => (
                      <tr
                        key={article._id}
                        className="border-b border-fuchsia-200 hover:bg-fuchsia-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            {article.cover_photo ? (
                              <Image
                                src={article.cover_photo}
                                alt={article.title}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded-md border border-fuchsia-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-fuchsia-100 rounded-md border border-fuchsia-200 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <span className="line-clamp-1">
                              {article.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              article.category === "Research"
                                ? "bg-blue-100 text-blue-800"
                                : article.category === "Innovation"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {article.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {article.owner && article.owner.username}
                          {article.contributors &&
                            article.contributors.length > 0 && (
                              <span className="text-xs text-gray-500 block">
                                {article.contributors.length} contributor(s)
                              </span>
                            )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(
                              article.publish_date
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-gray-400" />
                            {article.views ? article.views.count : 0}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/article/${article._id}`)
                              }
                              className="text-fuchsia-600 hover:text-fuchsia-700 hover:bg-fuchsia-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/admin/articles/edit/${article._id}`
                                )
                              }
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteArticle(article._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default withAdminAuth(AdminArticlesPage);
