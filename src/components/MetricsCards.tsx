
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardsProps {
  metrics: {
    marketCap: number;
    volume24h: number;
    btcDominance: number;
    totalValueLocked: number;
  };
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  const cards = [
    {
      title: 'Total Value Locked',
      value: `$${metrics.totalValueLocked.toFixed(1)}B`,
      change: '+2.4%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: '24h Oracle Volume',
      value: `$${metrics.volume24h.toFixed(1)}B`,
      change: '+5.1%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: 'Cross-Chain Activity',
      value: `${metrics.btcDominance.toFixed(1)}%`,
      change: '-0.8%',
      isPositive: false,
      icon: TrendingDown
    },
    {
      title: 'Active Oracles',
      value: `${Math.floor(metrics.marketCap * 10)}`,
      change: '+12.3%',
      isPositive: true,
      icon: TrendingUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
              <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-700 transition-colors">
                <card.icon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${card.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {card.change}
                </span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${card.isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.abs(parseFloat(card.change))}0%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
