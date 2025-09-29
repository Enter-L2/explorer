'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsLoading(true);

    try {
      // Determine what type of search this is
      const searchType = detectSearchType(query.trim());
      
      switch (searchType) {
        case 'address':
          router.push(`/address/${query.trim()}`);
          break;
        case 'transaction':
          router.push(`/tx/${query.trim()}`);
          break;
        case 'block':
          router.push(`/block/${query.trim()}`);
          break;
        case 'batch':
          router.push(`/batch/${query.trim()}`);
          break;
        case 'name':
          router.push(`/name/${query.trim()}`);
          break;
        default:
          toast.error('Invalid search format. Try an address, transaction hash, block number, or name.');
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const detectSearchType = (input: string): string => {
    // Remove whitespace
    input = input.trim();

    // Transaction hash or block hash (0x followed by 64 hex characters)
    if (/^0x[a-fA-F0-9]{64}$/.test(input)) {
      return 'transaction';
    }

    // Address (0x followed by 40 hex characters)
    if (/^0x[a-fA-F0-9]{40}$/.test(input)) {
      return 'address';
    }

    // Block number (numeric)
    if (/^\d+$/.test(input)) {
      return 'block';
    }

    // Batch number (batch: prefix followed by number)
    if (/^batch:\d+$/i.test(input)) {
      return 'batch';
    }

    // ENS-like name (alphanumeric with dots, no spaces)
    if (/^[a-zA-Z0-9.-]+$/.test(input) && input.includes('.')) {
      return 'name';
    }

    // Simple name (alphanumeric, no special characters)
    if (/^[a-zA-Z0-9]+$/.test(input)) {
      return 'name';
    }

    return 'unknown';
  };

  const clearSearch = () => {
    setQuery('');
  };

  const searchSuggestions = [
    { type: 'Address', example: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b' },
    { type: 'Transaction', example: '0x1234567890abcdef...' },
    { type: 'Block', example: '12345' },
    { type: 'Batch', example: 'batch:123' },
    { type: 'Name', example: 'alice' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by address, transaction hash, block number, batch, or name..."
            className="block w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            disabled={isLoading}
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-12 flex items-center pr-2"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Search'
              )}
            </motion.div>
          </button>
        </div>
      </form>

      {/* Search suggestions */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2 font-medium">Search examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {searchSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion.example)}
              className="text-left p-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {suggestion.type}:
              </span>
              <br />
              <span className="text-xs font-mono">
                {suggestion.example.length > 20 
                  ? `${suggestion.example.slice(0, 20)}...` 
                  : suggestion.example
                }
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
