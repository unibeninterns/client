"use client";

import { useState, useEffect } from "react";
import { withAdminAuth } from "@/lib/auth";
import { authApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Mail,
  Check,
  AlertCircle,
  User,
  Clock,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddResearcherDialog, setShowAddResearcherDialog] = useState(false);
  const [researcherForm, setResearcherForm] = useState({
    name: "",
    email: "",
    faculty: "",
    title: "",
    bio: "",
    profilePicture: null,
  });

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await authApi.getInvitations();
        setInvitations(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        setError(error.message || "Failed to load invitations");
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      await authApi.inviteResearcher(email);
      setSuccess(`Invitation sent to ${email}`);

      // Refresh the invitation list
      const response = await authApi.getInvitations();
      setInvitations(response.data);

      setEmail("");
      setTimeout(() => setShowInviteDialog(false), 1500);
    } catch (error) {
      setError(error.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendInvitation = async (id) => {
    try {
      await authApi.resendInvitation(id);

      // Refresh invitations list
      const response = await authApi.getInvitations();
      setInvitations(response.data);

      setSuccess("Invitation resent successfully");
    } catch (error) {
      console.error("Error resending invitation:", error);
      setError(error.message || "Failed to resend invitation");
    }
  };

  const deleteInvitation = async (id) => {
    if (confirm("Are you sure you want to delete this invitation?")) {
      try {
        await authApi.deleteInvitation(id);
        setInvitations(
          invitations.filter((invitation) => invitation.id !== id)
        );
        setSuccess("Invitation deleted successfully");
      } catch (error) {
        console.error("Error deleting invitation:", error);
        setError(error.message || "Failed to delete invitation");
      }
    }
  };

  const handleAddResearcher = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", researcherForm.name);
      formData.append("email", researcherForm.email);
      formData.append("faculty", researcherForm.faculty);
      formData.append("title", researcherForm.title);
      formData.append("bio", researcherForm.bio);

      if (researcherForm.profilePicture) {
        formData.append("profilePicture", researcherForm.profilePicture);
      }

      await authApi.addResearcherProfile(formData);
      setSuccess(`Researcher profile created for ${researcherForm.email}`);

      setResearcherForm({
        name: "",
        email: "",
        faculty: "",
        title: "",
        bio: "",
        profilePicture: null,
      });

      setTimeout(() => setShowAddResearcherDialog(false), 1500);
    } catch (error) {
      setError(error.message || "Failed to create researcher profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    setResearcherForm({
      ...researcherForm,
      profilePicture: e.target.files[0],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResearcherForm({
      ...researcherForm,
      [name]: value,
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "added":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "accepted":
        return <Check className="h-4 w-4 mr-1" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "rejected":
        return <X className="h-4 w-4 mr-1" />;
      case "added":
        return <Check className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Researcher Management
          </h1>
          <p className="text-gray-600 mt-1">
            Invite and manage researchers for the platform
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors shadow-md">
                <Mail className="mr-2 h-4 w-4" />
                Invite Researcher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  Invite Researcher
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Send an invitation email to a new researcher to join the
                  platform.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSendInvite} className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="researcher@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Invitation"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showAddResearcherDialog}
            onOpenChange={setShowAddResearcherDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Researcher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 bg-gradient-to-br from-fuchsia-50 via-white to-fuchsia-100 rounded-xl shadow-xl border-0 max-h-[90vh] overflow-y-auto">
              <Card className="shadow-none border-0 bg-transparent">
                <CardHeader className="space-y-1 pb-6 text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Add Researcher Profile
                  </CardTitle>
                  <CardDescription className="text-center text-gray-600">
                    Create a new researcher profile directly. The researcher
                    will receive login credentials by email.
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

                  {success && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleAddResearcher} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile Picture (Optional)
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          {researcherForm.profilePicture ? (
                            <Image
                              src={URL.createObjectURL(
                                researcherForm.profilePicture
                              )}
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
                            id="researcher-pic"
                            name="profilePicture"
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleFileChange}
                            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Max size: 3MB. Accepted formats: JPEG, PNG, JPG
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="researcher-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Full Name *
                        </label>
                        <Input
                          id="researcher-name"
                          name="name"
                          placeholder="Dr. Jane Smith"
                          value={researcherForm.name}
                          onChange={handleInputChange}
                          className="h-12 border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="researcher-title"
                          className="text-sm font-medium text-gray-700"
                        >
                          Title *
                        </label>
                        <Input
                          id="researcher-title"
                          name="title"
                          placeholder="Professor, Dr., Lecturer"
                          value={researcherForm.title}
                          onChange={handleInputChange}
                          className="h-12 border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                          required
                        />
                      </div>
                    </div>

                    {/* NEW: Email and Faculty Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="researcher-email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email Address *
                        </label>
                        <Input
                          id="researcher-email"
                          name="email"
                          type="email"
                          placeholder="researcher@gmail.com"
                          value={researcherForm.email}
                          onChange={handleInputChange}
                          className="h-12 border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="researcher-faculty"
                          className="text-sm font-medium text-gray-700"
                        >
                          Faculty/Department *
                        </label>
                        <Input
                          id="researcher-faculty"
                          name="faculty"
                          placeholder="Computer Science"
                          value={researcherForm.faculty}
                          onChange={handleInputChange}
                          className="h-12 border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="researcher-bio"
                        className="text-sm font-medium text-gray-700"
                      >
                        Bio & Research Interests *
                      </label>
                      <Textarea
                        id="researcher-bio"
                        name="bio"
                        placeholder="Tell us about the researcher's background and interests..."
                        value={researcherForm.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="min-h-[120px] border-gray-300 focus:border-fuchsia-500 focus:ring-fuchsia-200 resize-none"
                        required
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 ml-auto">
                          {researcherForm.bio.length}/500 characters
                        </p>
                      </div>
                    </div>

                    <DialogFooter className="pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddResearcherDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Profile...
                          </div>
                        ) : (
                          "Create Profile"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </CardContent>
                <CardFooter className="justify-center pt-6">
                  <p className="text-sm text-gray-500 text-center">
                    After registration, the researcher will receive login
                    credentials via email
                    <br />
                    <span className="text-xs">
                      Join our community of researchers and scholars
                    </span>
                  </p>
                </CardFooter>
              </Card>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Invitations Card */}
      <Card className="rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-white py-4">
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Mail className="h-5 w-5 text-fuchsia-600" />
            Researcher Invitations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 hidden sm:table-cell">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 hidden sm:table-cell">
                    Expires
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invitations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No invitations found.
                    </td>
                  </tr>
                ) : (
                  invitations.map((invitation) => (
                    <tr
                      key={invitation.id}
                      className="border-b hover:bg-fuchsia-50 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium text-gray-900">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-fuchsia-600 mr-2 hidden sm:block" />
                          {invitation.email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            invitation.status
                          )}`}
                        >
                          {getStatusIcon(invitation.status)}
                          {invitation.status.charAt(0).toUpperCase() +
                            invitation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600 hidden sm:table-cell">
                        {invitation.created}
                      </td>
                      <td className="px-4 py-4 text-gray-600 hidden sm:table-cell">
                        {invitation.expires}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {(invitation.status === "expired" ||
                            invitation.status === "rejected") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resendInvitation(invitation.id)}
                              className="text-fuchsia-600 hover:bg-fuchsia-100"
                            >
                              <Mail className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">
                                Resend
                              </span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInvitation(invitation.id)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
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
        <CardFooter className="bg-gray-50 py-3">
          <p className="text-xs text-gray-500">
            {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}{" "}
            total
          </p>
        </CardFooter>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {invitations.map((invitation) => (
          <Card
            key={invitation.id}
            className="hover:shadow-lg transition-shadow border border-gray-200 rounded-xl"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 text-fuchsia-600 mr-2" />
                  {invitation.email}
                </CardTitle>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    invitation.status
                  )}`}
                >
                  {getStatusIcon(invitation.status)}
                  {invitation.status.charAt(0).toUpperCase() +
                    invitation.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm">{invitation.created}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className="text-sm">{invitation.expires}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 justify-end">
              <div className="flex gap-2">
                {(invitation.status === "expired" ||
                  invitation.status === "rejected") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resendInvitation(invitation.id)}
                    className="text-fuchsia-600 hover:bg-fuchsia-100"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="ml-1">Resend</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteInvitation(invitation.id)}
                  className="text-red-600 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {success && !showInviteDialog && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default withAdminAuth(AdminInvitationsPage);
