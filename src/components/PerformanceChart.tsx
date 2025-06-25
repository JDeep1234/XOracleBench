
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface PerformanceChartProps {
  isRunning: boolean;
}

export const PerformanceChart = ({ isRunning }: PerformanceChartProps) => {
  const [data, setData] = useState([
    { name: 'Chainlink', latency: 2.3, tps: 145, gasValue: 45, color: 'bg-blue-500' },
    { name: 'Band Protocol', latency: 3.1, tps: 120, gasValue: 38, color: 'bg-purple-500' },
    { name: 'Tellor', latency: 4.2, tps: 95, gasValue: 52, color: 'bg-green-500' },
    { name: 'Custom Oracle', latency: 1.8, tps: 180, gasValue: 28, color: 'bg-orange-500' }
  ]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setData(prev => prev.map(item => ({
          ...item,
          latency: Math.max(0.5, item.latency + (Math.random() - 0.5) * 0.8),
          tps: Math.max(50, item.tps + (Math.random() - 0.5) * 30),
          gasValue: Math.max(15, item.gasValue + (Math.random() - 0.5) * 15)
        })));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const maxTps = Math.max(...data.map(d => d.tps));

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Oracle Performance Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time Bar Chart */}
        <div className="space-y-4">
          <h4 className="text-gray-300 text-sm font-medium">Throughput (TPS)</h4>
          <div className="space-y-3">
            {data.map((oracle, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium">{oracle.name}</span>
                  <span className="text-gray-400 text-sm">{oracle.tps.toFixed(0)} TPS</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${oracle.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${(oracle.tps / maxTps) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-xs">AVG LATENCY</p>
            <p className="text-white font-bold">
              {(data.reduce((acc, d) => acc + d.latency, 0) / data.length).toFixed(1)}s
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">TOTAL TPS</p>
            <p className="text-white font-bold">
              {data.reduce((acc, d) => acc + d.tps, 0).toFixed(0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">AVG GAS</p>
            <p className="text-white font-bold">
              {(data.reduce((acc, d) => acc + d.gasValue, 0) / data.length).toFixed(0)} Gwei
            </p>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          {data.map((oracle, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${oracle.color} ${isRunning ? 'animate-pulse' : ''}`}></div>
              <span className="text-gray-300 text-xs">{oracle.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
