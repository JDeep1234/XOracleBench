import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SecurityPanelProps {
  isRunning: boolean;
}

export const SecurityPanel = ({ isRunning }: SecurityPanelProps) => {
  const [security, setSecurity] = useState({
    mevProtection: { status: 'good', score: 85 },
    consensus: { status: 'warning', score: 72 },
    cryptographic: { status: 'good', score: 95 },
    flashLoan: { status: 'good', score: 88 },
    frontRunning: { status: 'warning', score: 78 },
    manipulation: { status: 'error', score: 65 }
  });

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setSecurity(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            const current = updated[key as keyof typeof updated];
            const newScore = Math.floor(Math.max(50, Math.min(100, current.score + (Math.random() - 0.5) * 10)));
            updated[key as keyof typeof updated] = {
              score: newScore,
              status: newScore >= 85 ? 'good' : newScore >= 70 ? 'warning' : 'error'
            };
          });
          return updated;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const securityChecks = [
    { key: 'mevProtection', label: 'MEV Protection', ...security.mevProtection },
    { key: 'consensus', label: 'Consensus Mechanism', ...security.consensus },
    { key: 'cryptographic', label: 'Cryptographic Security', ...security.cryptographic },
    { key: 'flashLoan', label: 'Flash Loan Resistance', ...security.flashLoan },
    { key: 'frontRunning', label: 'Front-Running Protection', ...security.frontRunning },
    { key: 'manipulation', label: 'Price Manipulation', ...security.manipulation }
  ];

  const overallScore = Math.round(
    securityChecks.reduce((acc, check) => acc + check.score, 0) / securityChecks.length
  );

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Security Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Security Score */}
        <div className="text-center space-y-3">
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                className={`transition-all duration-1000 ${
                  overallScore >= 85 ? 'text-green-500' :
                  overallScore >= 70 ? 'text-yellow-500' : 'text-red-500'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{overallScore}%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Overall Security Score</p>
        </div>

        {/* Security Checks */}
        <div className="space-y-3">
          {securityChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.status)}
                <span className="text-white text-sm font-medium">{check.label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      check.status === 'good' ? 'bg-green-500' :
                      check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${check.score}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium w-12 text-right ${getStatusColor(check.status)}`}>
                  {check.score}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Security Status Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-green-400 text-lg font-bold">
              {securityChecks.filter(c => c.status === 'good').length}
            </p>
            <p className="text-gray-400 text-xs">SECURE</p>
          </div>
          <div className="text-center">
            <p className="text-yellow-400 text-lg font-bold">
              {securityChecks.filter(c => c.status === 'warning').length}
            </p>
            <p className="text-gray-400 text-xs">WARNING</p>
          </div>
          <div className="text-center">
            <p className="text-red-400 text-lg font-bold">
              {securityChecks.filter(c => c.status === 'error').length}
            </p>
            <p className="text-gray-400 text-xs">CRITICAL</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
