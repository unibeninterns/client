import React, { Suspense } from "react";
import SearchClient from "./search";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500 mb-4"></div>
            <p className="text-fuchsia-900 font-medium">
              Loading search results...
            </p>
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
