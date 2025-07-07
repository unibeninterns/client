"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  User,
  LogOut,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export default function ResearcherDashboardLayout({ children }) {
  const { user, logout, isResearcher, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (loading || !user || !isResearcher) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-fuchsia-50 to-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fuchsia-600 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-fuchsia-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading researcher dashboard...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/researcher", icon: LayoutDashboard },
    { name: "My Articles", href: "/researcher/articles", icon: FileText },
    { name: "Analytics", href: "/researcher/analytics", icon: BarChart2 },
    { name: "My Profile", href: "/researcher/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/researcher-login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-fuchsia-50">
      {/* Mobile sidebar */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-fuchsia-800 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <div className="text-xl font-bold text-white">Researcher Portal</div>
          <button
            className="p-1 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-700 rounded-md"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-5 px-2">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? "bg-fuchsia-700 text-white"
                      : "text-fuchsia-100 hover:bg-fuchsia-700"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="absolute bottom-0 w-full border-t border-fuchsia-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-fuchsia-100 hover:text-white w-full transition-colors duration-200"
            disabled={isLoggingOut}
          >
            <LogOut className="h-6 w-6 mr-3" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-300 bg-opacity-40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main layout grid */}
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-fuchsia-800">
            <div className="flex h-16 flex-shrink-0 items-center px-4">
              <div className="text-xl font-bold text-white">
                Researcher Portal
              </div>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? "bg-fuchsia-700 text-white"
                          : "text-fuchsia-100 hover:bg-fuchsia-700"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-fuchsia-700 p-4">
              <div className="group w-full flex flex-col">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() => setSubmenuOpen(!submenuOpen)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-fuchsia-800 font-medium text-sm">
                        {user?.name?.charAt(0) || "R"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user?.name || "Researcher"}
                      </p>
                      <p className="text-xs font-medium text-fuchsia-200">
                        {user?.email || "researcher@uniben.edu"}
                      </p>
                    </div>
                  </div>
                  {submenuOpen ? (
                    <ChevronUp className="h-5 w-5 text-fuchsia-200" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-fuchsia-200" />
                  )}
                </button>
                {submenuOpen && (
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center rounded-md py-2 pl-9 pr-2 text-sm font-medium text-fuchsia-100 hover:bg-fuchsia-800 hover:text-white"
                      disabled={isLoggingOut}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      {isLoggingOut ? "Logging out..." : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between bg-white px-4 py-2 shadow-sm h-16">
              <button
                id="sidebar-toggle"
                type="button"
                className="text-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="text-lg font-semibold text-fuchsia-800">
                Researcher Portal
              </div>
              <div className="text-sm text-fuchsia-800">
                {user?.name || "Researcher"}
              </div>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:block sticky top-0 z-10 flex-shrink-0 bg-white shadow-sm">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-semibold text-fuchsia-800">
                Researcher Portal
              </h1>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-fuchsia-50">
            <div className="py-6 px-4 sm:px-6 md:px-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
