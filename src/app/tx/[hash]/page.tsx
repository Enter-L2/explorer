import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { TransactionDetails } from '@/components/TransactionDetails';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getTransaction } from '@/lib/api';

interface TransactionPageProps {
  params: {
    hash: string;
  };
}

export async function generateMetadata({ params }: TransactionPageProps) {
  const { hash } = params;
  
  return {
    title: `Transaction ${hash.slice(0, 10)}... | Enter L2 Explorer`,
    description: `View details for transaction ${hash} on Enter L2 network`,
  };
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { hash } = params;

  // Validate hash format
  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transaction Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View comprehensive information about this transaction
          </p>
        </div>

        <Suspense fallback={<TransactionDetailsSkeleton />}>
          <TransactionDetailsWrapper hash={hash} />
        </Suspense>
      </div>
    </div>
  );
}

async function TransactionDetailsWrapper({ hash }: { hash: string }) {
  try {
    const transaction = await getTransaction(hash);
    
    if (!transaction) {
      notFound();
    }

    return <TransactionDetails transaction={transaction} />;
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
          Failed to Load Transaction
        </h2>
        <p className="text-red-600 dark:text-red-400">
          Unable to fetch transaction details. Please try again later.
        </p>
      </div>
    );
  }
}

function TransactionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Transaction Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Flow */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/4"></div>
          <div className="flex items-center justify-between">
            <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded flex-1 mx-4"></div>
            <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/4"></div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
