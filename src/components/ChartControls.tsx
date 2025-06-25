
import { Settings, TrendingUp, BarChart2 } from 'lucide-react';
import { useState } from 'react';

export const ChartControls = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [indicators, setIndicators] = useState({
    sma: false,
    ema: false,
    rsi: false,
    macd: false,
    volume: true
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
      >
        <Settings className="w-4 h-4 text-white" />
      </button>

      {showSettings && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10">
          <div className="p-3">
            <h4 className="text-white font-medium mb-3">Indicators</h4>
            <div className="space-y-2">
              {Object.entries(indicators).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setIndicators(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-gray-300 text-sm capitalize">{key.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-600 p-3">
            <h4 className="text-white font-medium mb-3">Chart Style</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-2 py-1 text-gray-300 hover:bg-gray-700 rounded text-sm">
                Dark Theme
              </button>
              <button className="w-full text-left px-2 py-1 text-gray-300 hover:bg-gray-700 rounded text-sm">
                Grid Lines
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
