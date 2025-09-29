'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Shield,
  Database
} from 'lucide-react';
import { formatNumber, formatCurrency, formatDuration } from '@/lib/utils';
import { getNetworkStats } from '@/lib/api';

export function NetworkStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['networkStats'],
    queryFn: getNetworkStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load network statistics</p>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Latest Block',
      value: formatNumber(stats?.latestBlock || 0),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: stats?.blockGrowth || 0,
    },
    {
      title: 'Total Transactions',
      value: formatNumber(stats?.totalTransactions || 0),
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: stats?.txGrowth || 0,
    },
    {
      title: 'Active Addresses',
      value: formatNumber(stats?.activeAddresses || 0),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: stats?.addressGrowth || 0,
    },
    {
      title: 'Total Value Locked',
      value: formatCurrency(stats?.totalValueLocked || 0),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      change: stats?.tvlGrowth || 0,
    },
    {
      title: 'TPS (24h avg)',
      value: formatNumber(stats?.averageTps || 0, 2),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      change: stats?.tpsGrowth || 0,
    },
    {
      title: 'Avg Block Time',
      value: formatDuration(stats?.averageBlockTime || 5000),
      icon: Clock,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
      change: stats?.blockTimeChange || 0,
    },
    {
      title: 'Verified Batches',
      value: formatNumber(stats?.verifiedBatches || 0),
      icon: Shield,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      change: stats?.batchGrowth || 0,
    },
    {
      title: 'Storage Used',
      value: formatNumber(stats?.storageUsed || 0) + ' GB',
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: stats?.storageGrowth || 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${item.bgColor}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            {item.change !== 0 && (
              <div className={`text-sm font-medium ${
                item.change > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {item.title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
