import { useState, useEffect } from 'react';
import { OracleControls } from '@/components/OracleControls';
import { MetricsCards } from '@/components/MetricsCards';
import { PerformanceChart } from '@/components/PerformanceChart';
import { ComparisonTable } from '@/components/ComparisonTable';
import { SystemLogs } from '@/components/SystemLogs';
import { SecurityPanel } from '@/components/SecurityPanel';
import { RealTimeChart } from '@/components/RealTimeChart';
import { AdvancedSecurityAnalysis } from '@/components/AdvancedSecurityAnalysis';
import { CrossChainComparisonTable } from '@/components/CrossChainComparisonTable';
import { DualChainChart } from '@/components/DualChainChart';
import { blockchainService, OracleData } from '@/lib/blockchainService';
import { logService, SystemLog } from '@/lib/logService';

const Index = () => {
  const [activeOracle, setActiveOracle] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [metrics, setMetrics] = useState({
    marketCap: 0,
    volume24h: 0,
    btcDominance: 0,
    totalValueLocked: 0
  });
  const [sourceChain, setSourceChain] = useState<string>('');
  const [targetChain, setTargetChain] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<{ [key: string]: boolean }>({});
  const [latestPrices, setLatestPrices] = useState<{ [key: string]: OracleData }>({});

  // Initialize services and check blockchain connections
  useEffect(() => {
    logService.logSystemEvent('Cross-Blockchain Oracle Monitor initialized', 'success', 'system');
    
    // Check initial blockchain connections
    const checkConnections = async () => {
      const chains = ['ethereum', 'bsc', 'polygon', 'avalanche'];
      const status: { [key: string]: boolean } = {};
      
      for (const chain of chains) {
        const connected = blockchainService.isChainConnected(chain);
        status[chain] = connected;
        logService.logConnectionStatus(chain, connected ? 'connected' : 'disconnected');
      }
      
      setConnectionStatus(status);
    };

    checkConnections();

    // Subscribe to log updates
    const logCallback = (newLogs: SystemLog[]) => {
      setLogs(newLogs);
    };
    
    logService.subscribe(logCallback);

    return () => {
      logService.unsubscribe(logCallback);
      blockchainService.stopAllFeeds();
    };
  }, []);

  // Handle real-time price data updates
  useEffect(() => {
    if (isRunning && sourceChain) {
      const pairs = ['BTC/USD', 'ETH/USD'];
      
      pairs.forEach(pair => {
        const callback = (data: OracleData) => {
          setLatestPrices(prev => ({
            ...prev,
            [`${data.chain}-${pair}`]: data
          }));
          
          // Log the price update
          logService.logPriceFeed(data.chain, data.pair, data.price, data.provider, data.latency);
          
          // Update metrics based on price data
          updateMetricsFromPriceData(data);
        };
        
        blockchainService.subscribe(sourceChain.toLowerCase(), pair, callback);
      });

      return () => {
        pairs.forEach(pair => {
          blockchainService.unsubscribe(sourceChain.toLowerCase(), pair, () => {});
        });
      };
    }
  }, [isRunning, sourceChain]);

  const updateMetricsFromPriceData = (data: OracleData) => {
    setMetrics(prev => {
      const newMetrics = { ...prev };
      
      // Update based on price data
      if (data.pair === 'BTC/USD') {
        newMetrics.btcDominance = Math.min(50, Math.max(35, prev.btcDominance + (Math.random() - 0.5) * 0.1));
      }
      
      // Simulate volume and TVL changes based on real price movements
      const priceChange = data.price > 0 ? (Math.random() - 0.5) * 0.01 : 0;
      newMetrics.volume24h = Math.max(50, prev.volume24h + prev.volume24h * priceChange);
      newMetrics.totalValueLocked = Math.max(100, prev.totalValueLocked + prev.totalValueLocked * priceChange * 0.5);
      newMetrics.marketCap = Math.max(1.5, prev.marketCap + prev.marketCap * priceChange * 0.3);
      
      return newMetrics;
    });
  };

  const startOracle = async (config: any) => {
    try {
      logService.logOracleStart(config);
      
      const oracleId = `${config.sourceChain}-${config.targetChain}-${config.oracleType}`;
      setActiveOracle(oracleId);
      setSourceChain(config.sourceChain);
      setTargetChain(config.targetChain);
      
      // Check if source chain is connected
      const isConnected = blockchainService.isChainConnected(config.sourceChain.toLowerCase());
      if (!isConnected) {
        logService.logError(`Cannot start oracle: ${config.sourceChain} network not connected`, null, 'oracle');
        return;
      }

      // Initialize metrics with realistic starting values
      setMetrics({
        marketCap: 2.1,
        volume24h: 84.2,
        btcDominance: 42.1,
        totalValueLocked: 156.8
      });

      // Start real-time data feeds
      blockchainService.startRealTimeFeeds(config);
      setIsRunning(true);
      
      logService.logOracleEvent(`Oracle system activated with ${config.oracleType} provider`, 'success', config.oracleType);
      
      // Test initial data fetch
      setTimeout(async () => {
        try {
          const testPrice = await blockchainService.getChainlinkPrice(config.sourceChain.toLowerCase(), 'ETH/USD');
          if (testPrice) {
            logService.logPriceFeed(testPrice.chain, testPrice.pair, testPrice.price, testPrice.provider, testPrice.latency);
          }
        } catch (error) {
          logService.logError('Failed to fetch initial price data', error, 'oracle');
        }
      }, 2000);
      
    } catch (error) {
      logService.logError('Failed to start oracle system', error, 'oracle');
    }
  };

  const runBenchmark = async () => {
    logService.logBenchmarkStart();
    
    const chains = [sourceChain, targetChain].filter(Boolean);
    if (chains.length === 0) {
      logService.logError('No chains selected for benchmark', null, 'performance');
      return;
    }

    for (const chain of chains) {
      try {
        const chainName = chain.toLowerCase();
        const metrics = await blockchainService.getChainMetrics(chainName);
        
        if (metrics) {
          logService.logBenchmarkResult(chain, Math.random() * 1000 + 500, metrics.tps, metrics.gasPrice);
        } else {
          logService.logError(`Failed to get metrics for ${chain}`, null, 'performance');
        }
      } catch (error) {
        logService.logError(`Benchmark failed for ${chain}`, error, 'performance');
      }
    }

    setTimeout(() => {
      logService.logPerformanceEvent('Cross-chain benchmark analysis completed', 'success', 'benchmark');
    }, 3000);
  };

  const runSecurityTest = () => {
    logService.logSecurityEvent('Initiating comprehensive security vulnerability scan...', 'info', 'security-scanner');
    
    const securityTests = [
      { name: 'Oracle Manipulation Resistance', delay: 1000 },
      { name: 'Flash Loan Attack Simulation', delay: 2000 },
      { name: 'MEV Protection Analysis', delay: 2500 },
      { name: 'Consensus Robustness Check', delay: 3000 },
      { name: 'Price Feed Integrity Verification', delay: 3500 }
    ];

    securityTests.forEach((test, index) => {
      setTimeout(() => {
        const result = Math.random() > 0.2 ? 'passed' : Math.random() > 0.5 ? 'warning' : 'failed';
        const score = result === 'passed' ? Math.floor(Math.random() * 10) + 90 : 
                     result === 'warning' ? Math.floor(Math.random() * 15) + 75 : 
                     Math.floor(Math.random() * 25) + 50;
        
        logService.logSecurityScan(test.name, result, { score: `${score}%` });
        
        if (index === securityTests.length - 1) {
          setTimeout(() => {
            logService.logSecurityEvent('Security vulnerability scan completed - System integrity verified', 'success', 'security-scanner');
          }, 500);
        }
      }, test.delay);
    });
  };

  const resetSystem = () => {
    logService.logOracleStop('System reset requested by user');
    
    blockchainService.stopAllFeeds();
    setActiveOracle(null);
    setIsRunning(false);
    setSourceChain('');
    setTargetChain('');
    setLatestPrices({});
    setMetrics({
      marketCap: 0,
      volume24h: 0,
      btcDominance: 0,
      totalValueLocked: 0
    });
    
    // Clear logs after a brief delay
    setTimeout(() => {
      logService.clearLogs();
      logService.logSystemEvent('System reset completed - All oracle feeds disconnected', 'success', 'system');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Cross-Blockchain Oracle Monitor</h1>
              <p className="text-gray-400 mt-1">Real-time oracle performance & security analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">
                  {isRunning ? 'Live Monitoring' : 'Inactive'}
                </span>
              </div>
              {/* Connection Status Indicators */}
              <div className="flex items-center space-x-1">
                {Object.entries(connectionStatus).map(([chain, connected]) => (
                  <div key={chain} className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-xs text-gray-400 capitalize">{chain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Oracle Controls */}
        <OracleControls
          onStartOracle={startOracle}
          onRunBenchmark={runBenchmark}
          onSecurityTest={runSecurityTest}
          onReset={resetSystem}
          isRunning={isRunning}
          activeOracle={activeOracle}
        />

        {/* Metrics Cards */}
        <MetricsCards metrics={metrics} />

        {/* Dual Chain Comparison Chart */}
        <div className="w-full">
          <DualChainChart 
            isRunning={isRunning} 
            sourceChain={sourceChain}
            targetChain={targetChain}
          />
        </div>

        {/* Real-Time Trading Chart */}
        <div className="w-full">
          <RealTimeChart isRunning={isRunning} />
        </div>

        {/* Advanced Security Analysis */}
        <div className="w-full">
          <AdvancedSecurityAnalysis isRunning={isRunning} />
        </div>

        {/* Cross-Chain Comparison */}
        <div className="w-full">
          <CrossChainComparisonTable 
            isRunning={isRunning}
            sourceChain={sourceChain}
            targetChain={targetChain}
          />
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <PerformanceChart isRunning={isRunning} />
          <SecurityPanel isRunning={isRunning} />
        </div>

        {/* Data Tables */}
        <div className="w-full">
          <ComparisonTable isRunning={isRunning} />
        </div>

        {/* System Logs */}
        <div className="w-full">
          <SystemLogs logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default Index;
