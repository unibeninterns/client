import React, { Suspense } from 'react';
import SearchClient from './search';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Searching</div>}>
      <SearchClient />
    </Suspense>
  );
}