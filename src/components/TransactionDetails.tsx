'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import { formatDistanceToNow } from 'date-fns';
import { formatEther, formatUnits } from 'ethers';
import { Transaction } from '@/types';
import { formatNumber, formatCurrency, truncateAddress } from '@/lib/utils';

interface TransactionDetailsProps {
  transaction: Transaction;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const [showRawData, setShowRawData] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    copy(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTransactionTypeLabel = (type: number) => {
    const types = {
      0: 'Transfer',
      1: 'Deposit',
      2: 'Withdrawal',
      3: 'Name Registration',
      4: 'Staking',
    };
    return types[type as keyof typeof types] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Transaction Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transaction Overview
          </h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
            {getStatusIcon(transaction.status)}
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Transaction Hash
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-900 dark:text-white">
                {transaction.hash}
              </span>
              <button
                onClick={() => copyToClipboard(transaction.hash, 'Transaction hash')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Type
            </label>
            <span className="text-gray-900 dark:text-white">
              {getTransactionTypeLabel(transaction.type)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Block Number
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white">
                {transaction.blockNumber ? formatNumber(transaction.blockNumber) : 'Pending'}
              </span>
              {transaction.blockNumber && (
                <a
                  href={`/block/${transaction.blockNumber}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Timestamp
            </label>
            <span className="text-gray-900 dark:text-white">
              {transaction.timestamp 
                ? formatDistanceToNow(new Date(transaction.timestamp * 1000), { addSuffix: true })
                : 'Pending'
              }
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Amount
            </label>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatEther(transaction.amount)} ETH
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Fee
            </label>
            <span className="text-gray-900 dark:text-white">
              {formatEther(transaction.fee)} ETH
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Gas Used
            </label>
            <span className="text-gray-900 dark:text-white">
              {transaction.gasUsed ? formatNumber(transaction.gasUsed) : 'N/A'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Nonce
            </label>
            <span className="text-gray-900 dark:text-white">
              {transaction.nonce}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Transaction Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Transaction Flow
        </h3>

        <div className="flex items-center justify-between">
          {/* From */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                FROM
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">From</p>
              <div className="flex items-center gap-2">
                <a
                  href={`/address/${transaction.from}`}
                  className="font-mono text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  {truncateAddress(transaction.from)}
                </a>
                <button
                  onClick={() => copyToClipboard(transaction.from, 'From address')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center">
              <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-1 w-20"></div>
              <ArrowRight className="w-6 h-6 text-gray-400 mx-2" />
              <div className="h-0.5 bg-gray-300 dark:bg-gray-600 flex-1 w-20"></div>
            </div>
          </div>

          {/* To */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                TO
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">To</p>
              <div className="flex items-center gap-2">
                <a
                  href={`/address/${transaction.to}`}
                  className="font-mono text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  {truncateAddress(transaction.to)}
                </a>
                <button
                  onClick={() => copyToClipboard(transaction.to, 'To address')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fee Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Fee Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Fee Amount
            </label>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatEther(transaction.fee)} ETH
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Fee Payer
            </label>
            <div className="flex items-center gap-2">
              <a
                href={`/address/${transaction.feePayer}`}
                className="font-mono text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                {truncateAddress(transaction.feePayer)}
              </a>
              <button
                onClick={() => copyToClipboard(transaction.feePayer, 'Fee payer address')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Fee Token
            </label>
            <span className="text-gray-900 dark:text-white">
              {transaction.feeToken === '0x0000000000000000000000000000000000000000' ? 'ETH' : 'USDC'}
            </span>
          </div>
        </div>

        {transaction.feePayer !== transaction.from && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Merchant-Paid Fee
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  This transaction fee was paid by a merchant wallet, enabling gasless transactions for consumers.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Raw Transaction Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Raw Transaction Data
          </h3>
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showRawData ? 'Hide' : 'Show'} Raw Data
          </button>
        </div>

        {showRawData && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {JSON.stringify(transaction, null, 2)}
            </pre>
          </div>
        )}
      </motion.div>
    </div>
  );
}
