
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Shield, Clock, DollarSign } from 'lucide-react';

interface CrossChainComparisonTableProps {
  isRunning: boolean;
  sourceChain: string;
  targetChain: string;
}

export const CrossChainComparisonTable = ({ isRunning, sourceChain, targetChain }: CrossChainComparisonTableProps) => {
  const [chainData, setChainData] = useState({
    ethereum: {
      name: 'Ethereum',
      gasPrice: 45.2,
      blockTime: 12.5,
      tps: 15,
      securityScore: 95,
      decentralization: 92,
      tvl: 58.2,
      oracleLatency: 2.8,
      fees24h: 3.2,
      validatorCount: 500000
    },
    bsc: {
      name: 'BSC',
      gasPrice: 5.1,
      blockTime: 3.0,
      tps: 65,
      securityScore: 78,
      decentralization: 65,
      tvl: 12.8,
      oracleLatency: 3.5,
      fees24h: 0.8,
      validatorCount: 41
    },
    polygon: {
      name: 'Polygon',
      gasPrice: 1.2,
      blockTime: 2.1,
      tps: 65,
      securityScore: 82,
      decentralization: 75,
      tvl: 8.9,
      oracleLatency: 2.1,
      fees24h: 0.3,
      validatorCount: 100
    },
    avalanche: {
      name: 'Avalanche',
      gasPrice: 25.8,
      blockTime: 1.8,
      tps: 4500,
      securityScore: 88,
      decentralization: 80,
      tvl: 15.6,
      oracleLatency: 1.9,
      fees24h: 1.2,
      validatorCount: 1200
    }
  });

  const [crossChainMetrics, setCrossChainMetrics] = useState({
    bridgeLatency: 45.2,
    bridgeFees: 12.50,
    successRate: 99.2,
    slippage: 0.15,
    liquidityDepth: 2.8,
    arbOpportunities: 6
  });

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setChainData(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(chainKey => {
            const chain = updated[chainKey as keyof typeof updated];
            updated[chainKey as keyof typeof updated] = {
              ...chain,
              gasPrice: Math.max(0.1, chain.gasPrice + (Math.random() - 0.5) * 2),
              tps: Math.max(10, chain.tps + (Math.random() - 0.5) * 10),
              oracleLatency: Math.max(0.5, chain.oracleLatency + (Math.random() - 0.5) * 0.5),
              fees24h: Math.max(0.1, chain.fees24h + (Math.random() - 0.5) * 0.2)
            };
          });
          return updated;
        });

        setCrossChainMetrics(prev => ({
          bridgeLatency: Math.max(20, prev.bridgeLatency + (Math.random() - 0.5) * 10),
          bridgeFees: Math.max(1, prev.bridgeFees + (Math.random() - 0.5) * 2),
          successRate: Math.max(95, Math.min(100, prev.successRate + (Math.random() - 0.5) * 1)),
          slippage: Math.max(0.01, prev.slippage + (Math.random() - 0.5) * 0.05),
          liquidityDepth: Math.max(1, prev.liquidityDepth + (Math.random() - 0.5) * 0.5),
          arbOpportunities: Math.max(0, prev.arbOpportunities + Math.floor((Math.random() - 0.7) * 3))
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getChainIcon = (chainName: string) => {
    const colors = {
      'Ethereum': 'bg-blue-500',
      'BSC': 'bg-yellow-500',
      'Polygon': 'bg-purple-500',
      'Avalanche': 'bg-red-500'
    };
    return colors[chainName as keyof typeof colors] || 'bg-gray-500';
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Cross-Chain Bridge Metrics */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Cross-Chain Bridge Analysis</span>
            {sourceChain && targetChain && (
              <span className="text-sm text-gray-400">
                ({sourceChain} ↔ {targetChain})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Bridge Latency</span>
              </div>
              <div className="text-xl font-bold text-white">{crossChainMetrics.bridgeLatency.toFixed(1)}s</div>
            </div>
            
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Bridge Fees</span>
              </div>
              <div className="text-xl font-bold text-white">{formatCurrency(crossChainMetrics.bridgeFees)}</div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Success Rate</span>
              </div>
              <div className="text-xl font-bold text-green-400">{formatPercentage(crossChainMetrics.successRate)}</div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">Slippage</span>
              </div>
              <div className="text-xl font-bold text-orange-400">{formatPercentage(crossChainMetrics.slippage)}</div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300 text-sm">Liquidity Depth</span>
              </div>
              <div className="text-xl font-bold text-cyan-400">${crossChainMetrics.liquidityDepth.toFixed(1)}M</div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">Arb Opportunities</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">{crossChainMetrics.arbOpportunities}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Chain Comparison */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Blockchain Performance Matrix</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Chain</TableHead>
                <TableHead className="text-gray-300">Gas Price</TableHead>
                <TableHead className="text-gray-300">Block Time</TableHead>
                <TableHead className="text-gray-300">TPS</TableHead>
                <TableHead className="text-gray-300">Security</TableHead>
                <TableHead className="text-gray-300">Decentralization</TableHead>
                <TableHead className="text-gray-300">TVL</TableHead>
                <TableHead className="text-gray-300">Oracle Latency</TableHead>
                <TableHead className="text-gray-300">24h Fees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(chainData).map((chain, index) => (
                <TableRow key={index} className="border-gray-700/50 hover:bg-gray-700/20">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getChainIcon(chain.name)} ${isRunning ? 'animate-pulse' : ''}`}></div>
                      <span className="text-white">{chain.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{chain.gasPrice.toFixed(1)} Gwei</TableCell>
                  <TableCell className="text-gray-300">{chain.blockTime.toFixed(1)}s</TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{chain.tps.toFixed(0)}</span>
                      {isRunning && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${getScoreColor(chain.securityScore)}`}>
                        {chain.securityScore}%
                      </span>
                      <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${getScoreColor(chain.securityScore).includes('green') ? 'bg-green-500' : getScoreColor(chain.securityScore).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${chain.securityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(chain.decentralization)}`}>
                      {chain.decentralization}%
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">${chain.tvl.toFixed(1)}B</TableCell>
                  <TableCell className="text-gray-300">{chain.oracleLatency.toFixed(1)}s</TableCell>
                  <TableCell className="text-gray-300">${chain.fees24h.toFixed(1)}M</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
