"use client";

import { useState } from "react";
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
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { z } from "zod";

// Define validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  faculty: z.string().min(2, "Faculty must be at least 2 characters"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
});

export default function ResearcherRegisterPage({ params }) {
  const { token } = params;
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Add file validation
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setValidationErrors({
          ...validationErrors,
          profilePicture: "Please upload a valid image file (JPEG, PNG)",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setValidationErrors({
          ...validationErrors,
          profilePicture: "Image size should be less than 5MB",
        });
        return;
      }

      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));

      // Clear any previous errors
      if (validationErrors.profilePicture) {
        const { profilePicture, ...rest } = validationErrors;
        setValidationErrors(rest);
      }
    }
  };

  const validateForm = () => {
    try {
      profileSchema.parse({ name, faculty, bio, title });
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

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("faculty", faculty);
      formData.append("bio", bio);
      formData.append("title", title);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await authApi.completeProfile(token, formData);
      setSuccess(true);

      // Redirect to login page after 3 seconds
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Registration Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="mb-4">
              Your profile has been successfully created. Your login credentials
              have been sent to your email.
            </p>
            <p>You will be redirected to the login page shortly...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Please provide your information to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={validationErrors.name ? "border-red-500" : ""}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="faculty" className="text-sm font-medium">
                Faculty/Department
              </label>
              <Input
                id="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className={validationErrors.faculty ? "border-red-500" : ""}
                required
              />
              {validationErrors.faculty && (
                <p className="text-sm text-red-500">
                  {validationErrors.faculty}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio (Interests and areas of expertise)
              </label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={validationErrors.bio ? "border-red-500" : ""}
                required
              />
              {validationErrors.bio && (
                <p className="text-sm text-red-500">{validationErrors.bio}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title (e.g., Professor, Dr., Lecturer)
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={validationErrors.title ? "border-red-500" : ""}
                required
              />
              {validationErrors.title && (
                <p className="text-sm text-red-500">{validationErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="profilePicture" className="text-sm font-medium">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className={
                    validationErrors.profilePicture ? "border-red-500" : ""
                  }
                />
              </div>
              {validationErrors.profilePicture && (
                <p className="text-sm text-red-500">
                  {validationErrors.profilePicture}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            After registration, you&apos;ll receive your login credentials via
            email
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
