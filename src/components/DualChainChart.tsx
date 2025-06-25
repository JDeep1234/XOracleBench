import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowRightLeft, Maximize2 } from 'lucide-react';

interface DualChainChartProps {
  isRunning: boolean;
  sourceChain: string;
  targetChain: string;
}

interface ChainPriceData {
  time: string;
  sourcePrice: number;
  targetPrice: number;
  priceDiff: number;
  timestamp: number;
}

export const DualChainChart = ({ isRunning, sourceChain, targetChain }: DualChainChartProps) => {
  const [priceData, setPriceData] = useState<ChainPriceData[]>([]);
  const [sourcePrice, setSourcePrice] = useState(106072.54);
  const [targetPrice, setTargetPrice] = useState(106125.18);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Initialize with sample data
    const initialData: ChainPriceData[] = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      const baseSourcePrice = 105000 + Math.sin(i * 0.1) * 2000;
      const baseTargetPrice = baseSourcePrice + (Math.random() - 0.5) * 500; // Small difference
      
      initialData.push({
        time: time.toLocaleTimeString('en-US', { hour12: false }),
        sourcePrice: baseSourcePrice,
        targetPrice: baseTargetPrice,
        priceDiff: baseTargetPrice - baseSourcePrice,
        timestamp: time.getTime()
      });
    }
    
    setPriceData(initialData);
    setSourcePrice(initialData[initialData.length - 1].sourcePrice);
    setTargetPrice(initialData[initialData.length - 1].targetPrice);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const now = new Date();
        const newSourcePrice = sourcePrice + (Math.random() - 0.5) * 500;
        const newTargetPrice = targetPrice + (Math.random() - 0.5) * 300; // Different volatility
        
        setSourcePrice(newSourcePrice);
        setTargetPrice(newTargetPrice);
        
        setPriceData(prev => {
          const newData = [...prev.slice(1), {
            time: now.toLocaleTimeString('en-US', { hour12: false }),
            sourcePrice: newSourcePrice,
            targetPrice: newTargetPrice,
            priceDiff: newTargetPrice - newSourcePrice,
            timestamp: now.getTime()
          }];
          return newData;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning, sourcePrice, targetPrice]);

  const chartConfig = {
    sourcePrice: {
      label: sourceChain || "Source Chain",
      color: "#06B6D4",
    },
    targetPrice: {
      label: targetChain || "Target Chain",
      color: "#F59E0B",
    },
  };

  const priceDifference = targetPrice - sourcePrice;
  const priceDiffPercentage = (priceDifference / sourcePrice) * 100;

  return (
    <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <span>Cross-Chain Price Comparison</span>
            {sourceChain && targetChain && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>{sourceChain}</span>
                <ArrowRightLeft className="w-4 h-4" />
                <span>{targetChain}</span>
              </div>
            )}
          </CardTitle>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">{sourceChain || 'Source Chain'}</div>
            <div className="text-xl font-bold text-cyan-400">
              ${sourcePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">{targetChain || 'Target Chain'}</div>
            <div className="text-xl font-bold text-yellow-400">
              ${targetPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Price Difference</div>
            <div className="flex items-center space-x-2">
              {priceDifference >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-lg font-bold ${priceDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(priceDifference).toFixed(2)} ({Math.abs(priceDiffPercentage).toFixed(3)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className={`${isFullscreen ? 'h-[calc(100vh-300px)]' : 'h-96'} bg-gray-900/30 rounded-lg p-4 overflow-hidden`}>
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={priceData}
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  interval="preserveStartEnd"
                  height={30}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  domain={['dataMin - 500', 'dataMax + 500']}
                  width={80}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                      name
                    ]}
                  />}
                  cursor={{ stroke: '#374151', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="sourcePrice"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#06B6D4', strokeWidth: 0 }}
                  name={sourceChain || 'Source Chain'}
                />
                <Line
                  type="monotone"
                  dataKey="targetPrice"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }}
                  name={targetChain || 'Target Chain'}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Arbitrage Opportunities */}
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Arbitrage Opportunity</span>
            <span className={`text-sm font-medium ${Math.abs(priceDiffPercentage) > 0.1 ? 'text-green-400' : 'text-gray-400'}`}>
              {Math.abs(priceDiffPercentage) > 0.1 ? 'PROFITABLE' : 'LOW MARGIN'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {priceDifference > 0 
              ? `Buy on ${sourceChain || 'Source'}, Sell on ${targetChain || 'Target'} for ${Math.abs(priceDiffPercentage).toFixed(3)}% profit`
              : `Buy on ${targetChain || 'Target'}, Sell on ${sourceChain || 'Source'} for ${Math.abs(priceDiffPercentage).toFixed(3)}% profit`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
