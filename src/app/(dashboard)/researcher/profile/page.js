"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withResearcherAuth } from "@/lib/auth";
import { researcherDashboardApi } from "@/lib/api";
import {
  RefreshCw,
  Users,
  Mail,
  Award,
  Building,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

function ResearcherProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await researcherDashboardApi.getProfile();
        if (response?.data?.profile) {
          setProfile(response.data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      </div>
      {profile && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Card - Left Side */}
          <div className="w-full lg:w-1/3">
            <Card className="border-fuchsia-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 border-b border-fuchsia-200">
                <CardTitle className="text-fuchsia-900 text-center">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-fuchsia-100 shadow-lg">
                    {profile.profilePicture ? (
                      <Image
                        src={getImageUrl(profile.profilePicture)}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 flex items-center justify-center">
                        <Users className="h-16 w-16 text-fuchsia-400" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-fuchsia-900 text-center mb-2">
                    {profile.name}
                  </h2>
                  <p className="text-gray-600 text-center mb-6 font-medium">
                    {profile.title || "Researcher"}
                  </p>

                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-fuchsia-50 rounded-lg border border-fuchsia-100">
                      <div className="p-2 bg-fuchsia-100 rounded-full">
                        <Mail className="h-4 w-4 text-fuchsia-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">
                          Email
                        </p>
                        <span className="text-sm font-medium text-gray-900">
                          {profile.email}
                        </span>
                      </div>
                    </div>

                    {profile.department && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Building className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            Department
                          </p>
                          <span className="text-sm font-medium text-gray-900">
                            {profile.department}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biography and Academic Info - Right Side */}
          <div className="w-full lg:w-2/3 space-y-6">
            <Card className="border-fuchsia-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 border-b border-fuchsia-200">
                <CardTitle className="text-fuchsia-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-gray max-w-none">
                  {profile.bio ? (
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No biography provided.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Add a biography to tell others about your research
                        interests and background.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-fuchsia-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 border-b border-fuchsia-200">
                <CardTitle className="text-fuchsia-900 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-fuchsia-50 rounded-lg border border-fuchsia-100">
                    <h3 className="font-semibold text-fuchsia-900 mb-2 flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-fuchsia-600" />
                      Faculty/ Department
                    </h3>
                    <p className="text-fuchsia-700">
                      {profile.faculty || "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default withResearcherAuth(ResearcherProfilePage);
