"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { withAdminAuth } from "@/lib/auth";
import { researchersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Search,
  User,
  Mail,
  Trash2,
  ExternalLink,
  CalendarClock,
  Building,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

function ResearchersPage() {
  const router = useRouter();

  const [researchers, setResearchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [researcherToDelete, setResearcherToDelete] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    try {
      setIsLoading(true);
      const response = await researchersApi.getResearchers();
      setResearchers(response.data);
    } catch (error) {
      console.error("Error fetching researchers:", error);
      setError("Failed to load researchers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (researcher) => {
    setResearcherToDelete(researcher);
    setDeleteDialogOpen(true);
  };

  const handleDeleteResearcher = async () => {
    try {
      await researchersApi.deleteResearcher(researcherToDelete._id);
      setResearchers(
        researchers.filter((r) => r.id !== researcherToDelete._id)
      );
      setSuccess(
        `${researcherToDelete.name} has been removed from the platform`
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting researcher:", error);
      setError(error.message || "Failed to delete researcher");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredResearchers = researchers.filter(
    (researcher) =>
      researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      researcher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      researcher.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl text-fuchsia-800 font-bold tracking-tight">
          Researchers
        </h1>
        <Button
          onClick={() => (window.location.href = "/admin/invitations")}
          className="w-full sm:w-auto bg-fuchsia-800 hover:bg-fuchsia-900 text-white"
        >
          <Mail className="mr-2 h-4 w-4" />
          Manage Invitations
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
          placeholder="Search researchers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Researchers List */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center justify-between">
            <span>Active Researchers ({filteredResearchers.length})</span>
            <div className="text-sm text-gray-500">
              {filteredResearchers.length} of {researchers.length} researchers
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredResearchers.length === 0 ? (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "No researchers match your search."
                  : "No researchers found."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredResearchers.map((researcher) => (
                <div
                  key={researcher._id}
                  className="p-4 sm:p-6 hover:bg-fuchsia-50 transition-colors duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Researcher Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center group-hover:bg-fuchsia-200 transition-colors">
                          <User className="h-6 w-6 text-fuchsia-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-fuchsia-900 transition-colors">
                            {researcher.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {researcher.title}
                          </p>

                          {/* Contact and Meta Info */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span className="truncate max-w-[200px]">
                                {researcher.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span>{researcher.faculty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarClock className="h-4 w-4" />
                              <span>
                                Joined {formatDate(researcher.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/researchers/${researcher._id}`)
                        }
                        className="flex items-center gap-2 hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="hidden sm:inline">View Profile</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(researcher)}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {researcherToDelete?.name} from the
              platform and delete all associated data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteResearcher}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAdminAuth(ResearchersPage);
