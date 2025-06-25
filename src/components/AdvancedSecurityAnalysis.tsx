import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Key, AlertTriangle, CheckCircle, XCircle, Eye, Zap, Network } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdvancedSecurityAnalysisProps {
  isRunning: boolean;
}

export const AdvancedSecurityAnalysis = ({ isRunning }: AdvancedSecurityAnalysisProps) => {
  const [cryptoMetrics, setCryptoMetrics] = useState({
    ecdsaSignatures: { strength: 92, status: 'secure' },
    merkleProofs: { strength: 88, status: 'secure' },
    zeroKnowledgeProofs: { strength: 85, status: 'secure' },
    hashFunctions: { strength: 95, status: 'secure' },
    encryptionStrength: { strength: 78, status: 'warning' },
    keyDerivation: { strength: 83, status: 'secure' }
  });

  const [attacks, setAttacks] = useState({
    sandwichAttacks: { detected: 2, blocked: 2, severity: 'medium' },
    flashLoanAttacks: { detected: 0, blocked: 0, severity: 'low' },
    frontRunning: { detected: 5, blocked: 4, severity: 'high' },
    mevExploits: { detected: 3, blocked: 3, severity: 'medium' },
    oracleManipulation: { detected: 1, blocked: 1, severity: 'critical' },
    consensusAttacks: { detected: 0, blocked: 0, severity: 'low' }
  });

  const [networkSecurity, setNetworkSecurity] = useState({
    nodeDistribution: 87,
    consensusParticipation: 92,
    networkLatency: 45,
    byzantineTolerance: 89,
    slashingEvents: 0,
    validatorUptime: 99
  });

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // Simulate dynamic security metrics with realistic whole number scores
        setCryptoMetrics(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            const current = updated[key as keyof typeof updated];
            // Generate whole numbers between 70-100 with realistic variations
            const variation = Math.floor((Math.random() - 0.5) * 6); // -3 to +3 variation
            const newStrength = Math.max(70, Math.min(100, Math.floor(current.strength + variation)));
            updated[key as keyof typeof updated] = {
              strength: newStrength,
              status: newStrength >= 85 ? 'secure' : newStrength >= 75 ? 'warning' : 'critical'
            };
          });
          return updated;
        });

        // Simulate attack detection
        if (Math.random() > 0.85) {
          setAttacks(prev => {
            const attackTypes = Object.keys(prev);
            const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            return {
              ...prev,
              [randomAttack]: {
                ...prev[randomAttack as keyof typeof prev],
                detected: prev[randomAttack as keyof typeof prev].detected + 1,
                blocked: prev[randomAttack as keyof typeof prev].blocked + (Math.random() > 0.2 ? 1 : 0)
              }
            };
          });
        }

        setNetworkSecurity(prev => ({
          ...prev,
          nodeDistribution: Math.floor(Math.max(80, Math.min(95, prev.nodeDistribution + (Math.random() - 0.5) * 3))),
          consensusParticipation: Math.floor(Math.max(85, Math.min(98, prev.consensusParticipation + (Math.random() - 0.5) * 2))),
          networkLatency: Math.floor(Math.max(20, Math.min(80, prev.networkLatency + (Math.random() - 0.5) * 8))),
          byzantineTolerance: Math.floor(Math.max(80, Math.min(95, prev.byzantineTolerance + (Math.random() - 0.5) * 2))),
          validatorUptime: Math.floor(Math.max(95, Math.min(100, prev.validatorUptime + (Math.random() - 0.5) * 2)))
        }));
      }, 2500); // Update every 2.5 seconds for better real-time feel

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const cryptoChecks = [
    { key: 'ecdsaSignatures', label: 'ECDSA Signatures', icon: Key, ...cryptoMetrics.ecdsaSignatures },
    { key: 'merkleProofs', label: 'Merkle Tree Proofs', icon: Network, ...cryptoMetrics.merkleProofs },
    { key: 'zeroKnowledgeProofs', label: 'ZK Proofs', icon: Eye, ...cryptoMetrics.zeroKnowledgeProofs },
    { key: 'hashFunctions', label: 'Hash Functions (SHA-256)', icon: Lock, ...cryptoMetrics.hashFunctions },
    { key: 'encryptionStrength', label: 'AES Encryption', icon: Shield, ...cryptoMetrics.encryptionStrength },
    { key: 'keyDerivation', label: 'Key Derivation (PBKDF2)', icon: Key, ...cryptoMetrics.keyDerivation }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cryptographic Security */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-400" />
            <span>Cryptographic Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cryptoChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <check.icon className="w-4 h-4 text-cyan-400" />
                <span className="text-white text-sm font-medium">{check.label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      check.status === 'secure' ? 'bg-green-500' :
                      check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${check.strength}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium w-12 text-right ${getStatusColor(check.status)}`}>
                  {check.strength}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attack Detection & Prevention */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span>Attack Detection & Prevention</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(attacks).map(([key, attack], index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`w-4 h-4 ${getSeverityColor(attack.severity)}`} />
                <span className="text-white text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Detected/Blocked</div>
                  <div className={`text-sm font-medium ${getSeverityColor(attack.severity)}`}>
                    {attack.detected}/{attack.blocked}
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  attack.blocked >= attack.detected ? 'bg-green-500' : 'bg-red-500'
                } ${isRunning ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Network Security Metrics */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Network className="w-5 h-5 text-purple-400" />
            <span>Network Security & Consensus</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="30"
                    stroke="currentColor" strokeWidth="6"
                    fill="transparent" className="text-gray-700"
                  />
                  <circle
                    cx="50" cy="50" r="30"
                    stroke="currentColor" strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - networkSecurity.nodeDistribution / 100)}`}
                    className="text-blue-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{networkSecurity.nodeDistribution}%</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs">Node Distribution</p>
            </div>

            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="30"
                    stroke="currentColor" strokeWidth="6"
                    fill="transparent" className="text-gray-700"
                  />
                  <circle
                    cx="50" cy="50" r="30"
                    stroke="currentColor" strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - networkSecurity.consensusParticipation / 100)}`}
                    className="text-green-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{networkSecurity.consensusParticipation}%</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs">Consensus Participation</p>
            </div>

            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="30"
                    stroke="currentColor" strokeWidth="6"
                    fill="transparent" className="text-gray-700"
                  />
                  <circle
                    cx="50" cy="50" r="30"
                    stroke="currentColor" strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - networkSecurity.byzantineTolerance / 100)}`}
                    className="text-purple-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{networkSecurity.byzantineTolerance}%</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs">Byzantine Tolerance</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{networkSecurity.networkLatency}ms</div>
              <p className="text-gray-400 text-xs">Network Latency</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{networkSecurity.validatorUptime}%</div>
              <p className="text-gray-400 text-xs">Validator Uptime</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{networkSecurity.slashingEvents}</div>
              <p className="text-gray-400 text-xs">Slashing Events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
