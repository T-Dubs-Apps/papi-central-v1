// PAPI Central - Data Sync Manager
// Syncs data across devices using GitHub Gist as backup
// Auto-saves conversations, projects, and settings

class PAPISync {
  constructor() {
    this.syncInterval = 60000; // 1 minute
    this.lastSync = null;
    this.pendingChanges = false;
    this.syncInProgress = false;
    this.githubToken = null;
    this.gistId = null;

    // What to sync
    this.syncKeys = [
      'papi_license',
      'aegis_license',
      'cortex_license',
      'automation_license',
      'no_knowledge_kit_license',
      'cortex_desktop_license',
      'master_admin',
      'current_user_email',
      'papi_tos_accepted',
      'ai_provider',
      'openai_key_1',
      'openai_key_2',
      'openai_key_3',
      'openai_key_4',
      'claude_key',
      'gemini_key',
    ];

    this.init();
  }

  init() {
    console.log('🔄 PAPI Sync Manager Initializing...');

    // Load GitHub token from localStorage
    this.githubToken = localStorage.getItem('papi_github_token');
    this.gistId = localStorage.getItem('papi_gist_id');

    // Watch for localStorage changes
    this.watchLocalStorage();

    // Start auto-sync if configured
    if (this.githubToken && this.gistId) {
      this.startAutoSync();
      console.log('✅ Auto-sync enabled');
    } else {
      console.log('ℹ️ Sync not configured. Set GitHub token to enable.');
    }
  }

  watchLocalStorage() {
    // Listen for storage events (from other tabs)
    window.addEventListener('storage', (e) => {
      if (this.syncKeys.includes(e.key)) {
        console.log(`📝 Detected change: ${e.key}`);
        this.pendingChanges = true;
      }
    });

    // Monkey-patch localStorage to detect same-tab changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key, value) => {
      originalSetItem.call(localStorage, key, value);
      if (this.syncKeys.includes(key)) {
        this.pendingChanges = true;
      }
    };
  }

  async configureSync(githubToken, gistId = null) {
    this.githubToken = githubToken;
    localStorage.setItem('papi_github_token', githubToken);

    if (gistId) {
      this.gistId = gistId;
      localStorage.setItem('papi_gist_id', gistId);
    } else {
      // Create new gist
      const newGistId = await this.createBackupGist();
      if (newGistId) {
        this.gistId = newGistId;
        localStorage.setItem('papi_gist_id', newGistId);
      }
    }

    // Start auto-sync
    this.startAutoSync();

    return this.gistId;
  }

  async createBackupGist() {
    if (!this.githubToken) {
      console.error('❌ No GitHub token configured');
      return null;
    }

    const data = this.collectSyncData();

    try {
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          Authorization: `token ${this.githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: 'PAPI Central Data Backup',
          public: false,
          files: {
            'papi-backup.json': {
              content: JSON.stringify(data, null, 2),
            },
          },
        }),
      });

      if (response.ok) {
        const gist = await response.json();
        console.log('✅ Created backup gist:', gist.id);
        return gist.id;
      } else {
        console.error('❌ Failed to create gist:', response.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Error creating gist:', error);
      return null;
    }
  }

  collectSyncData() {
    const data = {
      version: '1.0',
      timestamp: Date.now(),
      server: window.PAPIFailover?.getActiveServerName() || 'Unknown',
      data: {},
    };

    // Collect all sync keys
    this.syncKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        data.data[key] = value;
      }
    });

    // Add conversation histories
    const alienHistory = localStorage.getItem('alien_conversation_history');
    if (alienHistory) {
      data.data.alien_conversation_history = alienHistory;
    }

    // Add trial data
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('trial_')) {
        data.data[key] = localStorage.getItem(key);
      }
    });

    return data;
  }

  async syncToCloud() {
    if (!this.githubToken || !this.gistId) {
      console.warn('⚠️ Sync not configured');
      return false;
    }

    if (this.syncInProgress) {
      console.log('⏳ Sync already in progress...');
      return false;
    }

    this.syncInProgress = true;

    try {
      const data = this.collectSyncData();

      const response = await fetch(
        `https://api.github.com/gists/${this.gistId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `token ${this.githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: {
              'papi-backup.json': {
                content: JSON.stringify(data, null, 2),
              },
            },
          }),
        }
      );

      if (response.ok) {
        this.lastSync = Date.now();
        this.pendingChanges = false;
        localStorage.setItem('papi_last_sync', this.lastSync.toString());
        console.log('✅ Data synced to cloud');
        return true;
      } else {
        console.error('❌ Sync failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Sync error:', error);
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncFromCloud() {
    if (!this.githubToken || !this.gistId) {
      console.warn('⚠️ Sync not configured');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.github.com/gists/${this.gistId}`,
        {
          headers: {
            Authorization: `token ${this.githubToken}`,
          },
        }
      );

      if (response.ok) {
        const gist = await response.json();
        const content = gist.files['papi-backup.json'].content;
        const data = JSON.parse(content);

        // Apply data to localStorage
        Object.keys(data.data).forEach((key) => {
          localStorage.setItem(key, data.data[key]);
        });

        console.log('✅ Data restored from cloud');
        console.log(
          `📅 Backup from: ${new Date(data.timestamp).toLocaleString()}`
        );
        return true;
      } else {
        console.error('❌ Failed to fetch backup:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Restore error:', error);
      return false;
    }
  }

  startAutoSync() {
    setInterval(async () => {
      if (this.pendingChanges && !this.syncInProgress) {
        console.log('🔄 Auto-syncing changes...');
        await this.syncToCloud();
      }
    }, this.syncInterval);

    console.log('📡 Auto-sync started (1 minute intervals)');
  }

  exportBackup() {
    const data = this.collectSyncData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `papi-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('💾 Backup exported');
  }

  async importBackup(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate backup format
      if (!data.version || !data.data) {
        throw new Error('Invalid backup format');
      }

      // Confirm with user
      const itemCount = Object.keys(data.data).length;
      if (
        !confirm(
          `Import ${itemCount} items from backup dated ${new Date(data.timestamp).toLocaleString()}?`
        )
      ) {
        return false;
      }

      // Apply data
      Object.keys(data.data).forEach((key) => {
        localStorage.setItem(key, data.data[key]);
      });

      console.log('✅ Backup imported');
      return true;
    } catch (error) {
      console.error('❌ Import error:', error);
      alert('Failed to import backup: ' + error.message);
      return false;
    }
  }

  getSyncStatus() {
    return {
      configured: !!(this.githubToken && this.gistId),
      lastSync: this.lastSync,
      pendingChanges: this.pendingChanges,
      syncInProgress: this.syncInProgress,
      itemCount: this.syncKeys.filter(
        (key) => localStorage.getItem(key) !== null
      ).length,
    };
  }
}

// Global instance
window.PAPISync = new PAPISync();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PAPISync;
}
