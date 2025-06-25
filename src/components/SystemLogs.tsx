import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertTriangle, XCircle, Terminal, Info, Shield, Zap, Activity, Settings } from 'lucide-react';
import { SystemLog } from '@/lib/logService';

interface SystemLogsProps {
  logs: SystemLog[];
}

export const SystemLogs = ({ logs }: SystemLogsProps) => {
  const getLogIcon = (log: SystemLog) => {
    // First check by category for specific icons
    switch (log.category) {
      case 'oracle': 
        return log.type === 'success' ? <Zap className="w-4 h-4 text-cyan-500" /> : 
               log.type === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : 
               <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'security': 
        return log.type === 'success' ? <Shield className="w-4 h-4 text-green-500" /> : 
               log.type === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : 
               <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'performance': 
        return log.type === 'success' ? <Activity className="w-4 h-4 text-blue-500" /> : 
               log.type === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : 
               <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'blockchain': 
        return log.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> : 
               log.type === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : 
               <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'system': 
        return log.type === 'success' ? <Settings className="w-4 h-4 text-gray-400" /> : 
               log.type === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : 
               <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        // Fallback to type-based icons
        switch (log.type) {
          case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
          case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
          case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
          case 'info': return <Info className="w-4 h-4 text-blue-500" />;
          default: return <Terminal className="w-4 h-4 text-gray-500" />;
        }
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'oracle': return 'text-cyan-400';
      case 'security': return 'text-purple-400';
      case 'performance': return 'text-blue-400';
      case 'blockchain': return 'text-green-400';
      case 'system': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      oracle: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      security: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      performance: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      blockchain: 'bg-green-500/20 text-green-400 border-green-500/30',
      system: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    
    return colors[category as keyof typeof colors] || colors.system;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Real-Time System Activity Logs</span>
            <span className="text-sm text-gray-400">({logs.length} entries)</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Success</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Error</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Info</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 w-full">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No system activity yet</p>
                <p className="text-xs">Start an oracle to see real-time logs</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start space-x-3 p-3 bg-gray-700/20 rounded-lg hover:bg-gray-700/40 transition-colors animate-in slide-in-from-top-1 duration-300"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCategoryBadge(log.category)}`}>
                        {log.category.toUpperCase()}
                      </span>
                      {log.source && (
                        <span className="text-xs text-gray-500 font-mono">
                          [{log.source}]
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className={`text-sm font-medium ${getLogColor(log.type)} leading-relaxed`}>
                      {log.message}
                    </p>
                    {log.details && (
                      <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs text-gray-400 font-mono">
                        {typeof log.details === 'object' ? (
                          <div className="space-y-1">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-500">{key}:</span>
                                <span className="text-gray-300">{JSON.stringify(value)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>{log.details}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
