export interface SystemLog {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  category: 'oracle' | 'security' | 'performance' | 'system' | 'blockchain';
  source?: string;
  details?: any;
}

class LogService {
  private logs: SystemLog[] = [];
  private listeners: ((logs: SystemLog[]) => void)[] = [];
  private maxLogs = 100;

  subscribe(callback: (logs: SystemLog[]) => void) {
    this.listeners.push(callback);
    // Send current logs immediately
    callback([...this.logs]);
  }

  unsubscribe(callback: (logs: SystemLog[]) => void) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.logs]));
  }

  addLog(
    message: string, 
    type: SystemLog['type'] = 'info', 
    category: SystemLog['category'] = 'system',
    source?: string,
    details?: any
  ) {
    const log: SystemLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      category,
      source,
      details,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    // Add to beginning of array (newest first)
    this.logs.unshift(log);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Notify all subscribers
    this.notifyListeners();

    // Also log to console for debugging
    const emoji = this.getLogEmoji(type);
    const prefix = `[${category.toUpperCase()}]`;
    console.log(`${emoji} ${prefix} ${message}`, details ? details : '');

    return log;
  }

  private getLogEmoji(type: SystemLog['type']): string {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  }

  // Specialized logging methods
  logOracleEvent(message: string, type: SystemLog['type'] = 'success', source?: string, details?: any) {
    return this.addLog(message, type, 'oracle', source, details);
  }

  logSecurityEvent(message: string, type: SystemLog['type'] = 'warning', source?: string, details?: any) {
    return this.addLog(message, type, 'security', source, details);
  }

  logPerformanceEvent(message: string, type: SystemLog['type'] = 'info', source?: string, details?: any) {
    return this.addLog(message, type, 'performance', source, details);
  }

  logBlockchainEvent(message: string, type: SystemLog['type'] = 'info', source?: string, details?: any) {
    return this.addLog(message, type, 'blockchain', source, details);
  }

  logSystemEvent(message: string, type: SystemLog['type'] = 'info', source?: string, details?: any) {
    return this.addLog(message, type, 'system', source, details);
  }

  // Price feed specific logging
  logPriceFeed(chain: string, pair: string, price: number, provider: string, latency: number) {
    const message = `Price updated: ${pair} = $${price.toLocaleString()} (${provider} via ${chain})`;
    const details = { chain, pair, price, provider, latency: `${latency}ms` };
    return this.logOracleEvent(message, 'success', `${provider}-${chain}`, details);
  }

  logConnectionStatus(chain: string, status: 'connected' | 'disconnected', details?: any) {
    const message = `${chain} network ${status}`;
    const type = status === 'connected' ? 'success' : 'error';
    return this.logBlockchainEvent(message, type, chain, details);
  }

  logOracleStart(config: { sourceChain: string; targetChain: string; oracleType: string; dataType: string }) {
    const message = `Oracle started: ${config.oracleType} monitoring ${config.dataType} (${config.sourceChain} → ${config.targetChain})`;
    return this.logOracleEvent(message, 'success', config.oracleType, config);
  }

  logOracleStop(reason?: string) {
    const message = reason ? `Oracle stopped: ${reason}` : 'Oracle stopped by user';
    return this.logOracleEvent(message, 'warning', 'system');
  }

  logError(message: string, error: any, category: SystemLog['category'] = 'system') {
    const details = {
      error: error?.message || error,
      stack: error?.stack
    };
    return this.addLog(message, 'error', category, 'error-handler', details);
  }

  logBenchmarkStart() {
    return this.logPerformanceEvent('Starting cross-chain benchmark tests...', 'info', 'benchmark');
  }

  logBenchmarkResult(chain: string, latency: number, tps: number, gasPrice: number) {
    const message = `Benchmark result for ${chain}: ${latency}ms latency, ${tps} TPS, ${gasPrice} gwei`;
    const details = { chain, latency, tps, gasPrice };
    return this.logPerformanceEvent(message, 'success', 'benchmark', details);
  }

  logSecurityScan(type: string, result: 'passed' | 'failed' | 'warning', details?: any) {
    const message = `Security scan: ${type} - ${result.toUpperCase()}`;
    const logType = result === 'passed' ? 'success' : result === 'failed' ? 'error' : 'warning';
    return this.logSecurityEvent(message, logType, 'security-scanner', details);
  }

  clearLogs() {
    this.logs = [];
    this.notifyListeners();
    this.logSystemEvent('System logs cleared', 'info', 'system');
  }

  getLogs(): SystemLog[] {
    return [...this.logs];
  }

  getLogsByCategory(category: SystemLog['category']): SystemLog[] {
    return this.logs.filter(log => log.category === category);
  }

  getLogsByType(type: SystemLog['type']): SystemLog[] {
    return this.logs.filter(log => log.type === type);
  }

  getRecentLogs(count: number = 10): SystemLog[] {
    return this.logs.slice(0, count);
  }

  // Statistical methods
  getLogStats() {
    const total = this.logs.length;
    const byType = {
      success: this.logs.filter(l => l.type === 'success').length,
      warning: this.logs.filter(l => l.type === 'warning').length,
      error: this.logs.filter(l => l.type === 'error').length,
      info: this.logs.filter(l => l.type === 'info').length
    };
    
    const byCategory = {
      oracle: this.logs.filter(l => l.category === 'oracle').length,
      security: this.logs.filter(l => l.category === 'security').length,
      performance: this.logs.filter(l => l.category === 'performance').length,
      blockchain: this.logs.filter(l => l.category === 'blockchain').length,
      system: this.logs.filter(l => l.category === 'system').length
    };

    return {
      total,
      byType,
      byCategory,
      errorRate: total > 0 ? (byType.error / total * 100).toFixed(1) : '0.0',
      successRate: total > 0 ? (byType.success / total * 100).toFixed(1) : '0.0'
    };
  }
}

export const logService = new LogService(); 