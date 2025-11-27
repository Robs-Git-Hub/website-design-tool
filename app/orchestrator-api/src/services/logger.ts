/**
 * Application Logging Service
 *
 * Provides structured logging with in-memory buffer for recent events.
 * Logs are both written to stdout (for Render logs) and kept in memory
 * for retrieval via /api/v1/logs endpoint.
 */

export interface LogEntry {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: string;
  message: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory
  private startTime = new Date();

  /**
   * Log an informational message
   */
  info(category: string, message: string, metadata?: Record<string, any>) {
    this.log('INFO', category, message, metadata);
  }

  /**
   * Log a warning message
   */
  warn(category: string, message: string, metadata?: Record<string, any>) {
    this.log('WARN', category, message, metadata);
  }

  /**
   * Log an error message
   */
  error(category: string, message: string, metadata?: Record<string, any>) {
    this.log('ERROR', category, message, metadata);
  }

  /**
   * Log a debug message (only in development)
   */
  debug(category: string, message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('DEBUG', category, message, metadata);
    }
  }

  /**
   * Internal log method
   */
  private log(
    level: LogEntry['level'],
    category: string,
    message: string,
    metadata?: Record<string, any>
  ) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      metadata,
    };

    // Add to in-memory buffer
    this.logs.push(entry);

    // Trim buffer if needed
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also write to stdout for Render's log collection
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    console.log(
      `[${entry.timestamp.toISOString()}] [${level}] [${category}] ${message}${metadataStr}`
    );
  }

  /**
   * Get recent logs with optional filtering
   */
  getLogs(options?: {
    limit?: number;
    level?: LogEntry['level'];
    category?: string;
  }): LogEntry[] {
    let filtered = [...this.logs];

    // Filter by level if specified
    if (options?.level) {
      filtered = filtered.filter(log => log.level === options.level);
    }

    // Filter by category if specified
    if (options?.category) {
      filtered = filtered.filter(log => log.category === options.category);
    }

    // Apply limit
    const limit = options?.limit || 100;
    return filtered.slice(-limit);
  }

  /**
   * Get log statistics
   */
  getStats() {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startTime.getTime();

    const stats = {
      totalLogs: this.logs.length,
      byLevel: {
        INFO: this.logs.filter(l => l.level === 'INFO').length,
        WARN: this.logs.filter(l => l.level === 'WARN').length,
        ERROR: this.logs.filter(l => l.level === 'ERROR').length,
        DEBUG: this.logs.filter(l => l.level === 'DEBUG').length,
      },
      uptime: {
        ms: uptimeMs,
        seconds: Math.floor(uptimeMs / 1000),
        readable: this.formatUptime(uptimeMs),
      },
      startTime: this.startTime.toISOString(),
      memoryUsage: process.memoryUsage(),
    };

    return stats;
  }

  /**
   * Format uptime in human-readable format
   */
  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Clear all logs (for testing/reset)
   */
  clear() {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new Logger();
