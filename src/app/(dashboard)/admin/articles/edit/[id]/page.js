"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { withAdminAuth } from "@/lib/auth";
import {
  articlesApi,
  facultyApi,
  departmentApi,
  researchersApi,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  Save,
  RefreshCw,
  X,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "",
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
  const [wordCount, setWordCount] = useState(0);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);

  // Calculate word count when content changes
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).length;
    setWordCount(formData.content.trim() === "" ? 0 : words);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch article data
        const articleData = await articlesApi.getArticle(id);
        setArticle(articleData);

        // Fetch related data
        const [researchersData, facultiesData, departmentsData] =
          await Promise.all([
            researchersApi.getResearchers(),
            facultyApi.getFaculties(),
            departmentApi.getDepartments(),
          ]);

        // Ensure we're working with arrays
        const researchersArray = researchersData.data || [];
        const facultiesArray = facultiesData.data || [];
        const departmentsArray = Array.isArray(departmentsData)
          ? departmentsData
          : departmentsData.data || [];

        setResearchers(researchersArray);
        setFaculties(facultiesArray);
        setDepartments(departmentsArray);

        // Find the faculty and department codes based on IDs
        const facultyItem = facultiesArray.find(
          (f) => f._id === articleData.faculty
        );
        const departmentItem = departmentsArray.find(
          (d) => d._id === articleData.department
        );

        // Set form data
        setFormData({
          title: articleData.title || "",
          content: articleData.content || "",
          summary: articleData.summary || "",
          category: articleData.category || "Research",
          faculty: facultyItem?.code || "",
          department: departmentItem?.code || "",
          contributors: articleData.contributors
            ? articleData.contributors.map((c) => c._id)
            : [],
          cover_photo: null,
        });

        // Set cover photo preview if it exists
        if (articleData.cover_photo) {
          setCoverPhotoPreview(articleData.cover_photo);
        }
      } catch (error) {
        console.error("Error fetching article data:", error);
        setError("Failed to load article data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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

  const handleContributorToggle = (contributorId) => {
    setFormData((prev) => {
      // Check if contributors already includes this value
      if (prev.contributors.includes(contributorId)) {
        return {
          ...prev,
          contributors: prev.contributors.filter((id) => id !== contributorId),
        };
      } else {
        return {
          ...prev,
          contributors: [...prev.contributors, contributorId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate word count
    if (wordCount > 2000) {
      setError("Content exceeds the 2000 word limit");
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

    // Validate contributors (optional - remove if not needed)
    if (formData.contributors.length === 0) {
      setError("Please select at least one contributor");
      return;
    }

    setIsSaving(true);

    try {
      // Create FormData object for file upload
      const articleFormData = new FormData();
      articleFormData.append("title", formData.title);
      articleFormData.append("category", formData.category);
      articleFormData.append("content", formData.content);
      articleFormData.append("summary", formData.summary);
      articleFormData.append("faculty", formData.faculty);
      articleFormData.append("department", formData.department);

      // Add contributors if any
      if (formData.contributors && formData.contributors.length > 0) {
        formData.contributors.forEach((contributor) => {
          articleFormData.append("contributors[]", contributor);
        });
      }

      // Add cover photo if any
      if (formData.cover_photo) {
        articleFormData.append("cover_photo", formData.cover_photo);
      }

      await articlesApi.updateArticle(id, articleFormData);

      // Redirect back to articles management page
      router.push("/admin/articles");
    } catch (error) {
      setError(error.message || "Failed to update article");
    } finally {
      setIsSaving(false);
    }
  };

  // Get filtered departments based on selected faculty
  const filteredDepartments = Array.isArray(departments)
    ? departments.filter(
        (dept) => !formData.faculty || dept.faculty === formData.faculty
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          asChild
          className="border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50"
        >
          <Link href="/admin/articles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </Button>
      </div>

      <div className="bg-gradient-to-br from-white to-fuchsia-50 rounded-xl shadow-lg border border-fuchsia-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
          Edit Article
        </h1>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-200 bg-red-50"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
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

          {/* Summary */}
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

          {/* Category & Contributors */}
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
                      checked={formData.contributors.includes(researcher._id)}
                      onChange={() => handleContributorToggle(researcher._id)}
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

          {/* Faculty & Department */}
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
                  {Array.isArray(faculties) &&
                    faculties.map((faculty) => (
                      <SelectItem
                        key={faculty._id}
                        value={faculty.code}
                        title={faculty.title}
                      >
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
                      title={department.title}
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

          {/* Cover Photo */}
          <div className="space-y-2">
            <Label
              htmlFor="cover_photo"
              className="text-sm font-medium text-gray-700"
            >
              Cover Photo
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
                    src={getImageUrl(coverPhotoPreview)}
                    alt="Cover preview"
                    className="w-16 h-16 object-cover rounded-lg border border-fuchsia-200"
                    width={64}
                    height={64}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, cover_photo: null }));
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

          {/* Content */}
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
                  wordCount > 2000
                    ? "bg-red-100 text-red-600"
                    : "bg-fuchsia-100 text-fuchsia-600"
                }`}
              >
                {wordCount}/2000 words
              </span>
            </div>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter article content"
              value={formData.content}
              onChange={handleInputChange}
              className="min-h-[300px] border-fuchsia-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-fuchsia-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/articles")}
              className="border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || wordCount > 2000 || summaryWordCount > 50}
              className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAdminAuth(EditArticlePage);
