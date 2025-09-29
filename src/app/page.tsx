import { Suspense } from 'react';
import { NetworkStats } from '@/components/NetworkStats';
import { LatestBlocks } from '@/components/LatestBlocks';
import { LatestTransactions } from '@/components/LatestTransactions';
import { SearchBar } from '@/components/SearchBar';
import { Hero } from '@/components/Hero';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <Hero />
      
      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </div>
      
      {/* Network Stats */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <NetworkStats />
        </Suspense>
      </div>
      
      {/* Latest Data */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Blocks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Latest Blocks
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <LatestBlocks />
            </Suspense>
          </div>
          
          {/* Latest Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Latest Transactions
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <LatestTransactions />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
