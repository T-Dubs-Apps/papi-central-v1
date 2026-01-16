// PAPI Central - Smart Failover System
// Automatically switches between servers if one fails
// Zero downtime, zero data loss

const PAPI_SERVERS = {
  primary: {
    name: 'Render',
    url: 'https://papi-fresh.onrender.com',
    priority: 1,
    healthCheck: 'https://papi-fresh.onrender.com/health.json',
  },
  secondary: {
    name: 'Netlify',
    url: 'https://papi-central.netlify.app',
    priority: 2,
    healthCheck: 'https://papi-central.netlify.app/health.json',
  },
  tertiary: {
    name: 'Vercel',
    url: 'https://papi-central.vercel.app',
    priority: 3,
    healthCheck: 'https://papi-central.vercel.app/health.json',
  },
  github: {
    name: 'GitHub Pages',
    url: 'https://troywalkerbrown.github.io/papi-central',
    priority: 4,
    healthCheck: 'https://troywalkerbrown.github.io/papi-central/health.json',
  },
  local: {
    name: 'Local Dev',
    url: 'http://localhost:8001',
    priority: 5,
    healthCheck: 'http://localhost:8001/health.json',
  },
};

class PAPIFailover {
  constructor() {
    this.currentServer = null;
    this.serverStatus = {};
    this.lastCheck = null;
    this.checkInterval = 30000; // 30 seconds
    this.failoverHistory = [];
    this.maxFailoverHistory = 50;

    // Initialize
    this.init();
  }

  async init() {
    console.log('🛡️ PAPI Failover System Initializing...');

    // Load last known good server
    const lastServer = localStorage.getItem('papi_active_server');
    if (lastServer && PAPI_SERVERS[lastServer]) {
      this.currentServer = lastServer;
    }

    // Check all servers
    await this.checkAllServers();

    // Select best available server
    await this.selectBestServer();

    // Start monitoring
    this.startMonitoring();

    console.log(`✅ Active Server: ${this.getActiveServerName()}`);
  }

  async checkAllServers() {
    const checkPromises = Object.keys(PAPI_SERVERS).map(async (key) => {
      const server = PAPI_SERVERS[key];
      const status = await this.checkServerHealth(server);
      this.serverStatus[key] = status;
      return { key, status };
    });

    await Promise.all(checkPromises);
    this.lastCheck = Date.now();

    // Save status to localStorage
    localStorage.setItem(
      'papi_server_status',
      JSON.stringify(this.serverStatus)
    );
    localStorage.setItem('papi_last_check', this.lastCheck.toString());
  }

  async checkServerHealth(server) {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(server.healthCheck, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache',
      });

      clearTimeout(timeout);

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          online: true,
          responseTime: responseTime,
          lastChecked: Date.now(),
          error: null,
        };
      } else {
        return {
          online: false,
          responseTime: responseTime,
          lastChecked: Date.now(),
          error: `HTTP ${response.status}`,
        };
      }
    } catch (error) {
      return {
        online: false,
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error.name === 'AbortError' ? 'Timeout' : error.message,
      };
    }
  }

  async selectBestServer() {
    // Get all online servers sorted by priority
    const onlineServers = Object.keys(PAPI_SERVERS)
      .filter((key) => this.serverStatus[key]?.online)
      .sort((a, b) => PAPI_SERVERS[a].priority - PAPI_SERVERS[b].priority);

    if (onlineServers.length === 0) {
      console.error('❌ No servers available! Using offline mode.');
      this.currentServer = null;
      return false;
    }

    const bestServer = onlineServers[0];

    // If server changed, record failover
    if (this.currentServer && this.currentServer !== bestServer) {
      this.recordFailover(this.currentServer, bestServer);
    }

    this.currentServer = bestServer;
    localStorage.setItem('papi_active_server', bestServer);

    return true;
  }

  recordFailover(fromServer, toServer) {
    const failoverEvent = {
      timestamp: Date.now(),
      from: fromServer,
      to: toServer,
      fromName: PAPI_SERVERS[fromServer]?.name || 'Unknown',
      toName: PAPI_SERVERS[toServer]?.name || 'Unknown',
      reason: this.serverStatus[fromServer]?.error || 'Unknown',
    };

    this.failoverHistory.unshift(failoverEvent);

    // Keep only last 50 events
    if (this.failoverHistory.length > this.maxFailoverHistory) {
      this.failoverHistory = this.failoverHistory.slice(
        0,
        this.maxFailoverHistory
      );
    }

    // Save to localStorage
    localStorage.setItem(
      'papi_failover_history',
      JSON.stringify(this.failoverHistory)
    );

    console.warn(
      `🔄 FAILOVER: ${failoverEvent.fromName} → ${failoverEvent.toName}`
    );

    // Show user notification
    this.showFailoverNotification(failoverEvent);
  }

  showFailoverNotification(event) {
    if (typeof this.onFailover === 'function') {
      this.onFailover(event);
    }

    // Optional: Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('PAPI Server Switch', {
        body: `Switched from ${event.fromName} to ${event.toName}`,
        icon: '/favicon.ico',
      });
    }
  }

  startMonitoring() {
    // Check servers every 30 seconds
    setInterval(async () => {
      await this.checkAllServers();

      // If current server is down, switch
      if (
        this.currentServer &&
        !this.serverStatus[this.currentServer]?.online
      ) {
        console.warn(
          `⚠️ Current server ${this.getActiveServerName()} is down!`
        );
        await this.selectBestServer();
      }
    }, this.checkInterval);

    console.log('📡 Server monitoring started (30s intervals)');
  }

  getActiveServerUrl() {
    if (!this.currentServer) return null;
    return PAPI_SERVERS[this.currentServer]?.url;
  }

  getActiveServerName() {
    if (!this.currentServer) return 'Offline';
    return PAPI_SERVERS[this.currentServer]?.name || 'Unknown';
  }

  getServerStatus() {
    return {
      currentServer: this.currentServer,
      currentServerName: this.getActiveServerName(),
      currentServerUrl: this.getActiveServerUrl(),
      allServers: this.serverStatus,
      lastCheck: this.lastCheck,
      failoverHistory: this.failoverHistory,
      onlineCount: Object.values(this.serverStatus).filter((s) => s.online)
        .length,
      totalServers: Object.keys(PAPI_SERVERS).length,
    };
  }

  forceServerSwitch(serverKey) {
    if (!PAPI_SERVERS[serverKey]) {
      console.error(`❌ Unknown server: ${serverKey}`);
      return false;
    }

    if (!this.serverStatus[serverKey]?.online) {
      console.error(`❌ Server ${PAPI_SERVERS[serverKey].name} is offline`);
      return false;
    }

    const oldServer = this.currentServer;
    this.currentServer = serverKey;
    localStorage.setItem('papi_active_server', serverKey);

    console.log(
      `🔄 Manual switch: ${PAPI_SERVERS[oldServer]?.name || 'Unknown'} → ${PAPI_SERVERS[serverKey].name}`
    );

    return true;
  }

  async manualHealthCheck() {
    console.log('🔍 Running manual health check...');
    await this.checkAllServers();
    await this.selectBestServer();
    return this.getServerStatus();
  }
}

// Global instance
window.PAPIFailover = new PAPIFailover();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PAPIFailover;
}
