"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthContext, AuthProvider } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboardLayout({ children }) {
  const { user, logout, isAdmin, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      console.log("Auth check in layout:", { user, isAdmin, loading });
      if (user !== null || isAdmin !== false) {
        router.push("/admin-login");
      }
    }
  }, [user, loading, isAdmin, router]);

  // If still loading or user is not admin, don't render anything
  if (loading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Articles", href: "/admin/articles", icon: FileText },
    { name: "Researchers", href: "/admin/researchers", icon: Users },
    { name: "Invitations", href: "/admin/invitations", icon: Mail },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Wait for the logout process to complete
      // This will make API call to backend and clear local tokens
      await logout();
      // Router push to login page is handled inside the logout function
    } catch (error) {
      console.error("Logout failed:", error);
      // In case of error, try to redirect anyway
      router.push("/admin-login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity ease-linear duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
        <div
          className={`fixed inset-y-0 left-0 flex flex-col z-40 w-72 bg-white shadow-xl transform ease-in-out duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h2>
            <button
              className="p-1 text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? "text-blue-700" : "text-gray-400"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <Button
              variant="ghost"
              className="flex items-center w-full text-sm font-medium text-gray-700"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-500"></div>
              ) : (
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              )}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Admin Dashboard
              </h2>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? "text-blue-700" : "text-gray-400"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <Button
                variant="ghost"
                className="flex items-center w-full text-sm font-medium text-gray-700"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-500"></div>
                ) : (
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                )}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="text-sm font-medium text-gray-700">
                  {user?.name || "Admin"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-6 px-4 sm:px-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
