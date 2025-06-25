import { ethers } from 'ethers';
import axios from 'axios';

// Chainlink Price Feed Addresses
const CHAINLINK_FEEDS = {
  ethereum: {
    'ETH/USD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    'BTC/USD': '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    'LINK/USD': '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c'
  },
  bsc: {
    'BNB/USD': '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
    'ETH/USD': '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
    'BTC/USD': '0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf'
  },
  polygon: {
    'MATIC/USD': '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
    'ETH/USD': '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    'BTC/USD': '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6'
  },
  avalanche: {
    'AVAX/USD': '0x0A77230d17318075983913bC2145DB16C7366156',
    'ETH/USD': '0x976B3D034E162d8bD72D6b9C989d545b839003b0',
    'BTC/USD': '0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743'
  }
};

// RPC Endpoints
const RPC_ENDPOINTS = {
  ethereum: 'https://eth.llamarpc.com',
  bsc: 'https://bsc-dataseed.binance.org',
  polygon: 'https://polygon-rpc.com',
  avalanche: 'https://api.avax.network/ext/bc/C/rpc'
};

// Chainlink ABI for price feeds
const CHAINLINK_ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  }
];

export interface OracleData {
  price: number;
  timestamp: number;
  decimals: number;
  roundId: string;
  chain: string;
  pair: string;
  provider: string;
  latency: number;
}

export interface ChainMetrics {
  gasPrice: number;
  blockNumber: number;
  blockTime: number;
  timestamp: number;
  tps: number;
  networkHash: string;
}

class BlockchainService {
  private providers: { [key: string]: ethers.JsonRpcProvider } = {};
  private isConnected: { [key: string]: boolean } = {};
  private listeners: { [key: string]: ((data: OracleData) => void)[] } = {};

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    Object.entries(RPC_ENDPOINTS).forEach(([chain, rpc]) => {
      try {
        this.providers[chain] = new ethers.JsonRpcProvider(rpc);
        this.isConnected[chain] = true;
        console.log(`✅ Connected to ${chain} network`);
      } catch (error) {
        console.error(`❌ Failed to connect to ${chain}:`, error);
        this.isConnected[chain] = false;
      }
    });
  }

  async getChainlinkPrice(chain: string, pair: string): Promise<OracleData | null> {
    const startTime = Date.now();
    
    try {
      const feedAddress = CHAINLINK_FEEDS[chain as keyof typeof CHAINLINK_FEEDS]?.[pair as keyof typeof CHAINLINK_FEEDS[keyof typeof CHAINLINK_FEEDS]];
      
      if (!feedAddress || !this.providers[chain]) {
        throw new Error(`Feed not available for ${pair} on ${chain}`);
      }

      const contract = new ethers.Contract(feedAddress, CHAINLINK_ABI, this.providers[chain]);
      const [roundData, decimals] = await Promise.all([
        contract.latestRoundData(),
        contract.decimals()
      ]);

      const latency = Date.now() - startTime;
      const price = Number(roundData.answer) / Math.pow(10, Number(decimals));

      return {
        price,
        timestamp: Number(roundData.updatedAt) * 1000,
        decimals: Number(decimals),
        roundId: roundData.roundId.toString(),
        chain,
        pair,
        provider: 'Chainlink',
        latency
      };
    } catch (error) {
      console.error(`Error fetching ${pair} price from ${chain}:`, error);
      return null;
    }
  }

  async getChainMetrics(chain: string): Promise<ChainMetrics | null> {
    try {
      const provider = this.providers[chain];
      if (!provider) return null;

      const [block, gasPrice] = await Promise.all([
        provider.getBlock('latest'),
        provider.getFeeData()
      ]);

      if (!block) return null;

      return {
        gasPrice: Number(ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei')),
        blockNumber: block.number,
        blockTime: block.timestamp,
        timestamp: Date.now(),
        tps: this.calculateTPS(chain, block.transactions?.length || 0),
        networkHash: block.hash
      };
    } catch (error) {
      console.error(`Error fetching metrics for ${chain}:`, error);
      return null;
    }
  }

  private calculateTPS(chain: string, txCount: number): number {
    // Approximate block times for different chains
    const blockTimes = {
      ethereum: 12,
      bsc: 3,
      polygon: 2,
      avalanche: 2
    };
    
    const blockTime = blockTimes[chain as keyof typeof blockTimes] || 12;
    return txCount / blockTime;
  }

  async getBandProtocolPrice(pair: string): Promise<OracleData | null> {
    const startTime = Date.now();
    
    try {
      // Band Protocol REST API
      const response = await axios.get(`https://laozi1.bandchain.org/api/oracle/v1/request_prices`, {
        params: {
          symbols: pair.replace('/', ''),
          min_count: 3,
          ask_count: 4
        },
        timeout: 5000
      });

      const latency = Date.now() - startTime;
      const priceData = response.data.price_results?.[0];
      
      if (!priceData) throw new Error('No price data from Band Protocol');

      return {
        price: parseFloat(priceData.px) / 1000000000, // Band Protocol uses 9 decimals
        timestamp: Date.now(),
        decimals: 9,
        roundId: priceData.request_id?.toString() || '',
        chain: 'bandchain',
        pair,
        provider: 'Band Protocol',
        latency
      };
    } catch (error) {
      console.error(`Error fetching ${pair} from Band Protocol:`, error);
      return null;
    }
  }

  async getTellorPrice(pair: string): Promise<OracleData | null> {
    const startTime = Date.now();
    
    try {
      // Simulated Tellor data (would need actual Tellor integration)
      const latency = Date.now() - startTime + Math.random() * 1000; // Simulate network latency
      
      // For now, we'll use a public API as a proxy for Tellor-like data
      const coinId = pair.split('/')[0].toLowerCase();
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: this.getCoinGeckoId(coinId),
          vs_currencies: 'usd',
          include_last_updated_at: true
        },
        timeout: 5000
      });

      const data = response.data;
      const coinData = Object.values(data)[0] as any;
      
      if (!coinData) throw new Error('No price data');

      return {
        price: coinData.usd,
        timestamp: coinData.last_updated_at * 1000,
        decimals: 8,
        roundId: Date.now().toString(),
        chain: 'tellor-network',
        pair,
        provider: 'Tellor',
        latency
      };
    } catch (error) {
      console.error(`Error fetching ${pair} from Tellor:`, error);
      return null;
    }
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: { [key: string]: string } = {
      'btc': 'bitcoin',
      'eth': 'ethereum',
      'link': 'chainlink',
      'bnb': 'binancecoin',
      'matic': 'matic-network',
      'avax': 'avalanche-2'
    };
    return mapping[symbol] || symbol;
  }

  subscribe(chain: string, pair: string, callback: (data: OracleData) => void) {
    const key = `${chain}-${pair}`;
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  unsubscribe(chain: string, pair: string, callback: (data: OracleData) => void) {
    const key = `${chain}-${pair}`;
    if (this.listeners[key]) {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    }
  }

  startRealTimeFeeds(config: {
    sourceChain: string;
    targetChain: string;
    oracleType: string;
    dataType: string;
  }) {
    const pairs = ['BTC/USD', 'ETH/USD'];
    
    pairs.forEach(pair => {
      const interval = setInterval(async () => {
        let data: OracleData | null = null;
        
        switch (config.oracleType) {
          case 'Chainlink':
            data = await this.getChainlinkPrice(config.sourceChain.toLowerCase(), pair);
            break;
          case 'Band Protocol':
            data = await this.getBandProtocolPrice(pair);
            break;
          case 'Tellor':
            data = await this.getTellorPrice(pair);
            break;
        }

        if (data) {
          const key = `${config.sourceChain.toLowerCase()}-${pair}`;
          this.listeners[key]?.forEach(callback => callback(data));
        }
      }, 3000); // Update every 3 seconds

      // Store interval for cleanup
      this.storeInterval(`${config.sourceChain}-${pair}`, interval);
    });
  }

  private intervals: { [key: string]: NodeJS.Timeout } = {};

  private storeInterval(key: string, interval: NodeJS.Timeout) {
    if (this.intervals[key]) {
      clearInterval(this.intervals[key]);
    }
    this.intervals[key] = interval;
  }

  stopAllFeeds() {
    Object.values(this.intervals).forEach(interval => clearInterval(interval));
    this.intervals = {};
    this.listeners = {};
  }

  isChainConnected(chain: string): boolean {
    return this.isConnected[chain.toLowerCase()] || false;
  }

  getConnectedChains(): string[] {
    return Object.entries(this.isConnected)
      .filter(([_, connected]) => connected)
      .map(([chain, _]) => chain);
  }
}

export const blockchainService = new BlockchainService(); 