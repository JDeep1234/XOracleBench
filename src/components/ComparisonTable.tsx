import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface ComparisonTableProps {
  isRunning: boolean;
}

export const ComparisonTable = ({ isRunning }: ComparisonTableProps) => {
  const [oracles, setOracles] = useState([
    {
      name: 'Chainlink',
      latency: '2.3s',
      tps: 145,
      gasCost: '45 Gwei',
      securityScore: 95,
      decentralization: 'High',
      uptime: '99.9%'
    },
    {
      name: 'Band Protocol',
      latency: '3.1s',
      tps: 120,
      gasCost: '38 Gwei',
      securityScore: 88,
      decentralization: 'Medium',
      uptime: '99.7%'
    },
    {
      name: 'Tellor',
      latency: '4.2s',
      tps: 95,
      gasCost: '52 Gwei',
      securityScore: 82,
      decentralization: 'High',
      uptime: '99.5%'
    },
    {
      name: 'Custom Oracle',
      latency: '1.8s',
      tps: 180,
      gasCost: '28 Gwei',
      securityScore: 76,
      decentralization: 'Low',
      uptime: '99.2%'
    }
  ]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setOracles(prev => prev.map(oracle => ({
          ...oracle,
          tps: Math.max(50, oracle.tps + (Math.random() - 0.5) * 20),
          securityScore: Math.floor(Math.max(60, Math.min(100, oracle.securityScore + (Math.random() - 0.5) * 5)))
        })));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDecentralizationColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Oracle Comparison Matrix</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Oracle</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Latency</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">TPS</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Gas Cost</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Security</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Decentralization</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Uptime</th>
              </tr>
            </thead>
            <tbody>
              {oracles.map((oracle, index) => (
                <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        oracle.name === 'Chainlink' ? 'bg-blue-500' :
                        oracle.name === 'Band Protocol' ? 'bg-purple-500' :
                        oracle.name === 'Tellor' ? 'bg-green-500' : 'bg-orange-500'
                      } ${isRunning ? 'animate-pulse' : ''}`}></div>
                      <span className="text-white font-medium">{oracle.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{oracle.latency}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{oracle.tps.toFixed(0)}</span>
                      {isRunning && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{oracle.gasCost}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${getScoreColor(oracle.securityScore)}`}>
                        {oracle.securityScore.toFixed(0)}%
                      </span>
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            oracle.securityScore >= 90 ? 'bg-green-500' :
                            oracle.securityScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${oracle.securityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${getDecentralizationColor(oracle.decentralization)}`}>
                      {oracle.decentralization}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{oracle.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
