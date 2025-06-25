
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, BarChart3, Shield, RotateCcw } from 'lucide-react';

interface OracleControlsProps {
  onStartOracle: (config: any) => void;
  onRunBenchmark: () => void;
  onSecurityTest: () => void;
  onReset: () => void;
  isRunning: boolean;
  activeOracle: string | null;
}

export const OracleControls = ({ 
  onStartOracle, 
  onRunBenchmark, 
  onSecurityTest, 
  onReset, 
  isRunning, 
  activeOracle 
}: OracleControlsProps) => {
  const [sourceChain, setSourceChain] = useState('');
  const [targetChain, setTargetChain] = useState('');
  const [oracleType, setOracleType] = useState('');
  const [dataType, setDataType] = useState('');

  const blockchains = ['Ethereum', 'BSC', 'Polygon', 'Avalanche'];
  const oracles = ['Chainlink', 'Band Protocol', 'Tellor', 'Custom Oracle'];
  const dataTypes = ['Price Feed', 'Yield Data', 'DeFi Metrics', 'Volatility Index'];

  const handleStartOracle = () => {
    if (sourceChain && targetChain && oracleType && dataType) {
      onStartOracle({ sourceChain, targetChain, oracleType, dataType });
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Oracle Configuration & Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Source Blockchain</label>
            <Select value={sourceChain} onValueChange={setSourceChain}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {blockchains.map(chain => (
                  <SelectItem key={chain} value={chain} className="text-white hover:bg-gray-600">
                    {chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Target Blockchain</label>
            <Select value={targetChain} onValueChange={setTargetChain}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {blockchains.map(chain => (
                  <SelectItem key={chain} value={chain} className="text-white hover:bg-gray-600">
                    {chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Oracle Provider</label>
            <Select value={oracleType} onValueChange={setOracleType}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select oracle" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {oracles.map(oracle => (
                  <SelectItem key={oracle} value={oracle} className="text-white hover:bg-gray-600">
                    {oracle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Data Type</label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select data" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {dataTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-white hover:bg-gray-600">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Configuration Display */}
        {activeOracle && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Active Oracle Feed</span>
            </div>
            <p className="text-white text-sm">
              {sourceChain} → {targetChain} | {oracleType} | {dataType}
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleStartOracle}
            disabled={!sourceChain || !targetChain || !oracleType || !dataType}
            className="bg-green-600 hover:bg-green-700 text-white h-12 transition-all duration-200 hover:scale-105"
          >
            <Play className="w-4 h-4 mr-2" />
            START ORACLE
          </Button>

          <Button
            onClick={onRunBenchmark}
            disabled={!isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 transition-all duration-200 hover:scale-105"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            RUN BENCHMARK
          </Button>

          <Button
            onClick={onSecurityTest}
            disabled={!isRunning}
            className="bg-yellow-600 hover:bg-yellow-700 text-white h-12 transition-all duration-200 hover:scale-105"
          >
            <Shield className="w-4 h-4 mr-2" />
            SECURITY TEST
          </Button>

          <Button
            onClick={onReset}
            className="bg-red-600 hover:bg-red-700 text-white h-12 transition-all duration-200 hover:scale-105"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            RESET SYSTEM
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
