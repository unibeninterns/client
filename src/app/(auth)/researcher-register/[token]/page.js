"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, User, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  faculty: z.string().min(2, "Faculty must be at least 2 characters"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
});

export default function ResearcherRegisterPage({ params }) {
  const { token } = typeof params.then === "function" ? use(params) : params;
  const [formData, setFormData] = useState({
    name: "",
    faculty: "",
    bio: "",
    title: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setValidationErrors({
          ...validationErrors,
          profilePicture: "Please upload a valid image file (JPEG, PNG)",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors({
          ...validationErrors,
          profilePicture: "Image size should be less than 5MB",
        });
        return;
      }

      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));

      if (validationErrors.profilePicture) {
        const { profilePicture, ...rest } = validationErrors;
        setValidationErrors(rest);
      }
    }
  };

  const validateForm = () => {
    try {
      profileSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setValidationErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (profilePicture) {
        submitData.append("profilePicture", profilePicture);
      }

      await authApi.completeProfile(token, submitData);
      setSuccess(true);

      setTimeout(() => {
        router.push("/researcher-login");
      }, 3000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to complete registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-fuchsia-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 backdrop-blur-sm bg-white/80">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Registration Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-6 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium mb-2">
                Your profile has been successfully created!
              </p>
              <p className="text-green-700 text-sm">
                Your login credentials have been sent to your email address.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-fuchsia-600 rounded-full animate-pulse"></div>
              <p className="text-sm">Redirecting to login page...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-fuchsia-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fuchsia-600 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Join our research community by providing your details
          </p>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Researcher Registration
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Please provide your information to complete your registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-200 bg-red-50"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Picture
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Profile preview"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-4 border-fuchsia-100 shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center border-4 border-fuchsia-100 shadow-lg">
                        <User className="h-8 w-8 text-fuchsia-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                      className={`cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100 ${
                        validationErrors.profilePicture
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum 5MB. Supported formats: JPEG, PNG
                    </p>
                  </div>
                </div>
                {validationErrors.profilePicture && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.profilePicture}
                  </p>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`h-12 transition-all duration-200 ${
                      validationErrors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                    }`}
                    placeholder="Dr. John Smith"
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`h-12 transition-all duration-200 ${
                      validationErrors.title
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                    }`}
                    placeholder="Professor, Dr., Lecturer"
                    required
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="faculty"
                  className="text-sm font-medium text-gray-700"
                >
                  Faculty/Department *
                </label>
                <Input
                  id="faculty"
                  value={formData.faculty}
                  onChange={(e) => handleInputChange("faculty", e.target.value)}
                  className={`h-12 transition-all duration-200 ${
                    validationErrors.faculty
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                  }`}
                  placeholder="Computer Science"
                  required
                />
                {validationErrors.faculty && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.faculty}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Bio & Research Interests *
                </label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={`min-h-[120px] transition-all duration-200 resize-none ${
                    validationErrors.bio
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                  }`}
                  placeholder="Tell us about your research interests, areas of expertise, and academic background..."
                  required
                />
                <div className="flex justify-between items-center">
                  {validationErrors.bio && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.bio}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Profile...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pt-6">
            <p className="text-sm text-gray-500 text-center">
              After registration, you&apos;ll receive your login credentials via
              email
              <br />
              <span className="text-xs">
                Join our community of researchers and scholars
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
