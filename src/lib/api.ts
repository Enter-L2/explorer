// API client for Enter L2 Explorer

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.enterl2.com';
const NODE_RPC_URL = process.env.NEXT_PUBLIC_NODE_RPC_URL || 'https://rpc.enterl2.com';

// Types
export interface NetworkStats {
  latestBlock: number;
  totalTransactions: number;
  activeAddresses: number;
  totalValueLocked: number;
  averageTps: number;
  averageBlockTime: number;
  verifiedBatches: number;
  storageUsed: number;
  blockGrowth: number;
  txGrowth: number;
  addressGrowth: number;
  tvlGrowth: number;
  tpsGrowth: number;
  blockTimeChange: number;
  batchGrowth: number;
  storageGrowth: number;
}

export interface Transaction {
  hash: string;
  type: number;
  status: string;
  from: string;
  to: string;
  amount: string;
  token?: string;
  fee: string;
  feePayer: string;
  feeToken: string;
  blockNumber?: number;
  blockHash?: string;
  transactionIndex?: number;
  gasUsed?: string;
  timestamp?: number;
  nonce: number;
  description?: string;
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  gasUsed: string;
  gasLimit: string;
  transactionCount: number;
  transactions?: Transaction[];
  stateRoot: string;
  batchHash?: string;
  sequencer: string;
}

export interface Address {
  address: string;
  balance: string;
  transactionCount: number;
  type: 'eoa' | 'contract' | 'consumer_wallet' | 'merchant_wallet';
  isContract: boolean;
  contractName?: string;
  walletInfo?: {
    type: 'consumer' | 'merchant';
    owner: string;
    whitelistEnabled: boolean;
    dailyLimit: string;
    operators: string[];
  };
}

export interface Batch {
  number: number;
  hash: string;
  timestamp: number;
  transactionCount: number;
  stateRoot: string;
  proof: string;
  status: 'pending' | 'verified' | 'finalized';
  l1TxHash?: string;
}

export interface NameInfo {
  name: string;
  owner: string;
  resolver: string;
  expiresAt: number;
  isPrimary: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
}

// API client class
class ApiClient {
  private baseUrl: string;
  private rpcUrl: string;

  constructor(baseUrl: string, rpcUrl: string) {
    this.baseUrl = baseUrl;
    this.rpcUrl = rpcUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  private async rpcRequest<T>(method: string, params: any[] = []): Promise<T> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`RPC error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result;
    } catch (error) {
      console.error(`RPC request failed: ${method}`, error);
      throw error;
    }
  }

  // Network statistics
  async getNetworkStats(): Promise<NetworkStats> {
    return this.request<NetworkStats>('/api/v1/stats');
  }

  // Transactions
  async getTransaction(hash: string): Promise<Transaction | null> {
    try {
      return await this.rpcRequest<Transaction>('eth_getTransactionByHash', [hash]);
    } catch (error) {
      return null;
    }
  }

  async getLatestTransactions(limit: number = 10): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/api/v1/transactions?limit=${limit}`);
  }

  async getTransactionsByAddress(address: string, page: number = 1, limit: number = 20): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.request(`/api/v1/addresses/${address}/transactions?page=${page}&limit=${limit}`);
  }

  // Blocks
  async getBlock(numberOrHash: string | number): Promise<Block | null> {
    try {
      if (typeof numberOrHash === 'number' || /^\d+$/.test(numberOrHash.toString())) {
        return await this.rpcRequest<Block>('eth_getBlockByNumber', [`0x${Number(numberOrHash).toString(16)}`, true]);
      } else {
        return await this.rpcRequest<Block>('eth_getBlockByHash', [numberOrHash, true]);
      }
    } catch (error) {
      return null;
    }
  }

  async getLatestBlocks(limit: number = 10): Promise<Block[]> {
    return this.request<Block[]>(`/api/v1/blocks?limit=${limit}`);
  }

  async getLatestBlockNumber(): Promise<number> {
    const result = await this.rpcRequest<string>('eth_blockNumber');
    return parseInt(result, 16);
  }

  // Addresses
  async getAddress(address: string): Promise<Address | null> {
    try {
      return await this.request<Address>(`/api/v1/addresses/${address}`);
    } catch (error) {
      return null;
    }
  }

  async getAddressBalance(address: string, tokenAddress?: string): Promise<string> {
    return await this.rpcRequest<string>('eth_getBalance', [address, 'latest']);
  }

  // Batches
  async getBatch(numberOrHash: string | number): Promise<Batch | null> {
    try {
      if (typeof numberOrHash === 'number' || /^\d+$/.test(numberOrHash.toString())) {
        return await this.rpcRequest<Batch>('enterl2_getBatchByNumber', [`0x${Number(numberOrHash).toString(16)}`]);
      } else {
        return await this.rpcRequest<Batch>('enterl2_getBatchByHash', [numberOrHash]);
      }
    } catch (error) {
      return null;
    }
  }

  async getLatestBatches(limit: number = 10): Promise<Batch[]> {
    return this.request<Batch[]>(`/api/v1/batches?limit=${limit}`);
  }

  // Names
  async getNameInfo(name: string): Promise<NameInfo | null> {
    try {
      return await this.rpcRequest<NameInfo>('enterl2_getNameInfo', [name]);
    } catch (error) {
      return null;
    }
  }

  async resolveAddress(address: string): Promise<string | null> {
    try {
      return await this.request<string>(`/api/v1/names/reverse/${address}`);
    } catch (error) {
      return null;
    }
  }

  // Search
  async search(query: string): Promise<{
    type: 'transaction' | 'block' | 'address' | 'batch' | 'name';
    result: any;
  } | null> {
    try {
      return await this.request(`/api/v1/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      return null;
    }
  }

  // Staking
  async getStakingInfo(address: string): Promise<any> {
    try {
      return await this.rpcRequest('enterl2_getStakingInfo', [address]);
    } catch (error) {
      return null;
    }
  }

  // Bridge
  async getBridgeStatus(txHash: string): Promise<any> {
    try {
      return await this.rpcRequest('enterl2_getBridgeStatus', [txHash]);
    } catch (error) {
      return null;
    }
  }

  // Wallet info
  async getWalletInfo(address: string): Promise<any> {
    try {
      return await this.rpcRequest('enterl2_getWalletInfo', [address]);
    } catch (error) {
      return null;
    }
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL, NODE_RPC_URL);

// Export individual functions for easier use
export const getNetworkStats = () => apiClient.getNetworkStats();
export const getTransaction = (hash: string) => apiClient.getTransaction(hash);
export const getLatestTransactions = (limit?: number) => apiClient.getLatestTransactions(limit);
export const getTransactionsByAddress = (address: string, page?: number, limit?: number) => 
  apiClient.getTransactionsByAddress(address, page, limit);
export const getBlock = (numberOrHash: string | number) => apiClient.getBlock(numberOrHash);
export const getLatestBlocks = (limit?: number) => apiClient.getLatestBlocks(limit);
export const getLatestBlockNumber = () => apiClient.getLatestBlockNumber();
export const getAddress = (address: string) => apiClient.getAddress(address);
export const getAddressBalance = (address: string, tokenAddress?: string) => 
  apiClient.getAddressBalance(address, tokenAddress);
export const getBatch = (numberOrHash: string | number) => apiClient.getBatch(numberOrHash);
export const getLatestBatches = (limit?: number) => apiClient.getLatestBatches(limit);
export const getNameInfo = (name: string) => apiClient.getNameInfo(name);
export const resolveAddress = (address: string) => apiClient.resolveAddress(address);
export const search = (query: string) => apiClient.search(query);
export const getStakingInfo = (address: string) => apiClient.getStakingInfo(address);
export const getBridgeStatus = (txHash: string) => apiClient.getBridgeStatus(txHash);
export const getWalletInfo = (address: string) => apiClient.getWalletInfo(address);

export default apiClient;
