import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon, ZoomIn, ZoomOut, Settings, Maximize2 } from 'lucide-react';
import { CandlestickChart } from './CandlestickChart';
import { ChartControls } from './ChartControls';

interface RealTimeChartProps {
  isRunning: boolean;
}

interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceData {
  time: string;
  price: number;
  volume: number;
  change: number;
}

export const RealTimeChart = ({ isRunning }: RealTimeChartProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(106072.54);
  const [change24h, setChange24h] = useState(1413.95);
  const [changePercent, setChangePercent] = useState(1.35);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'candlestick'>('candlestick');
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('1m');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Initialize with sample candlestick data
    const initialCandleData: CandleData[] = [];
    const initialPriceData: PriceData[] = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      const basePrice = 105000 + Math.sin(i * 0.1) * 2000;
      const open = basePrice + (Math.random() - 0.5) * 500;
      const close = open + (Math.random() - 0.5) * 800;
      const high = Math.max(open, close) + Math.random() * 300;
      const low = Math.min(open, close) - Math.random() * 300;
      
      initialCandleData.push({
        time: time.toLocaleTimeString('en-US', { hour12: false }),
        timestamp: time.getTime(),
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000
      });

      initialPriceData.push({
        time: time.toLocaleTimeString('en-US', { hour12: false }),
        price: close,
        volume: Math.random() * 1000000,
        change: close - open
      });
    }
    
    setCandleData(initialCandleData);
    setPriceData(initialPriceData);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const now = new Date();
        const lastCandle = candleData[candleData.length - 1];
        const newPrice = currentPrice + (Math.random() - 0.5) * 500;
        const newChange = newPrice - currentPrice;
        
        setCurrentPrice(newPrice);
        setChange24h(prev => prev + newChange * 0.1);
        setChangePercent(prev => prev + (newChange / currentPrice) * 100);
        
        // Update candlestick data
        setCandleData(prev => {
          const newCandle: CandleData = {
            time: now.toLocaleTimeString('en-US', { hour12: false }),
            timestamp: now.getTime(),
            open: lastCandle ? lastCandle.close : newPrice,
            high: Math.max(lastCandle ? lastCandle.close : newPrice, newPrice) + Math.random() * 200,
            low: Math.min(lastCandle ? lastCandle.close : newPrice, newPrice) - Math.random() * 200,
            close: newPrice,
            volume: Math.random() * 1000000
          };
          
          return [...prev.slice(1), newCandle];
        });

        setPriceData(prev => {
          const newData = [...prev.slice(1), {
            time: now.toLocaleTimeString('en-US', { hour12: false }),
            price: newPrice,
            volume: Math.random() * 1000000,
            change: newChange
          }];
          return newData;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning, currentPrice, candleData]);

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
    volume: {
      label: "Volume",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <span>Bitcoin Live Trading Chart</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('candlestick')}
              className={`p-2 rounded text-xs ${chartType === 'candlestick' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'} transition-colors`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded ${chartType === 'line' ? 'bg-cyan-500' : 'bg-gray-700'} transition-colors`}
            >
              <LineChartIcon className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded ${chartType === 'bar' ? 'bg-cyan-500' : 'bg-gray-700'} transition-colors`}
            >
              <BarChart3 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg">
          <div>
            <div className="text-2xl font-bold text-white">
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {changePercent >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(change24h).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
              </span>
              <span className="text-gray-400 text-sm">24h</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Volume</div>
            <div className="text-white font-semibold">
              ${(candleData[candleData.length - 1]?.volume || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs rounded ${
                  timeframe === tf ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-colors`}
              >
                {tf}
              </button>
            ))}
          </div>
          <ChartControls />
        </div>

        {/* Chart Container */}
        <div className={`${isFullscreen ? 'h-[calc(100vh-400px)]' : 'h-96'} bg-gray-900/30 rounded-lg p-4 overflow-hidden`}>
          {chartType === 'candlestick' ? (
            <CandlestickChart data={candleData} />
          ) : (
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
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
                      domain={['dataMin - 1000', 'dataMax + 1000']}
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
                      dataKey="price"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#06B6D4', strokeWidth: 0 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart 
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
                      domain={['dataMin - 1000', 'dataMax + 1000']}
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
                    <Bar
                      dataKey="volume"
                      fill="#06B6D4"
                      opacity={0.8}
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>

        {/* Trading Info Grid */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center bg-gray-900/30 p-3 rounded">
            <p className="text-gray-400 text-xs">OPEN</p>
            <p className="text-white font-semibold text-sm">
              ${candleData[0]?.open?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="text-center bg-gray-900/30 p-3 rounded">
            <p className="text-gray-400 text-xs">HIGH</p>
            <p className="text-green-400 font-semibold text-sm">
              ${Math.max(...candleData.map(d => d.high)).toFixed(2)}
            </p>
          </div>
          <div className="text-center bg-gray-900/30 p-3 rounded">
            <p className="text-gray-400 text-xs">LOW</p>
            <p className="text-red-400 font-semibold text-sm">
              ${Math.min(...candleData.map(d => d.low)).toFixed(2)}
            </p>
          </div>
          <div className="text-center bg-gray-900/30 p-3 rounded">
            <p className="text-gray-400 text-xs">CLOSE</p>
            <p className="text-white font-semibold text-sm">
              ${currentPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
