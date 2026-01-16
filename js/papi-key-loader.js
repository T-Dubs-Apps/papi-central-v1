/**
 * PAPI Key Loader - Universal API Key Management
 * Automatically loads API keys from Key Controller for any app
 *
 * Usage:
 * 1. Include this script in your HTML: <script src="papi-key-loader.js"></script>
 * 2. Call: const key = PAPI.loadKey('app-filename.html');
 * 3. Key is automatically loaded based on Key Controller assignments
 *
 * TEST MODE: Call PAPI.setupTestKeys() in console to auto-configure test keys
 */

const PAPI = {
  /**
   * Quick setup for testing - generates test keys
   * Run in browser console: PAPI.setupTestKeys()
   */
  setupTestKeys() {
    console.log('🔧 Setting up test API keys...');

    const generateTestKey = (provider) => {
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let key = '';

      if (provider === 'openai') {
        key = 'sk-proj-TEST_';
        for (let i = 0; i < 48; i++) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      } else if (provider === 'claude') {
        key = 'sk-ant-api03-TEST_';
        for (let i = 0; i < 64; i++) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      } else if (provider === 'gemini') {
        key = 'AIzaSyTEST_';
        for (let i = 0; i < 32; i++) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      return key;
    };

    // Generate 4 OpenAI keys
    for (let i = 1; i <= 4; i++) {
      const key = generateTestKey('openai');
      localStorage.setItem(`openai_api_key${i}`, key);
      console.log(`✅ OpenAI Key ${i}: ${key.substring(0, 20)}...`);
    }

    // Generate Claude and Gemini keys
    const claudeKey = generateTestKey('claude');
    localStorage.setItem('claude_api_key', claudeKey);
    console.log(`✅ Claude Key: ${claudeKey.substring(0, 25)}...`);

    const geminiKey = generateTestKey('gemini');
    localStorage.setItem('gemini_api_key', geminiKey);
    console.log(`✅ Gemini Key: ${geminiKey.substring(0, 20)}...`);

    // Activate master admin and licenses
    localStorage.setItem('master_admin', 'TROY_WALKER_2026');
    localStorage.setItem('papi_license', 'active');
    localStorage.setItem('beta_license', 'active');

    // Disable demo mode
    localStorage.removeItem('demo_mode');

    console.log('✅ Test keys configured! Reload page to use them.');
    console.log('🔑 Master Admin: ACTIVE');
    console.log('📝 Open test-setup.html for a visual interface');

    return true;
  },

  /**
   * Get the current page filename
   */
  getCurrentApp() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1);
  },

  /**
   * Load API key for the current app
   * @param {string} appName - Optional app name, defaults to current page
   * @param {string} provider - 'openai', 'claude', or 'gemini'
   * @returns {string|null} API key or null if not found
   */
  loadKey(appName = null, provider = 'openai') {
    appName = appName || this.getCurrentApp();

    // Auto-disable demo mode if real keys exist
    const hasRealKeys =
      this.getAnyAvailableKey('openai') ||
      this.getAnyAvailableKey('claude') ||
      this.getAnyAvailableKey('gemini');

    if (hasRealKeys && localStorage.getItem('demo_mode') === 'true') {
      localStorage.removeItem('demo_mode');
      console.log('✅ Real API keys detected - demo mode disabled');
    }

    // Check for demo mode (only if no real keys exist)
    if (localStorage.getItem('demo_mode') === 'true' && !hasRealKeys) {
      return 'demo-key-no-api-needed';
    }

    // Check if this app has a specific key assignment
    const assignment = localStorage.getItem(`assign-${appName}`);

    if (assignment === 'auto' || !assignment) {
      // Auto-rotate OpenAI keys
      const key = this.getRotatingOpenAIKey();
      if (key) return key;
    } else if (assignment === 'claude') {
      const key = localStorage.getItem('claude_api_key');
      if (key) return key;
    } else if (assignment === 'gemini') {
      const key = localStorage.getItem('gemini_api_key');
      if (key) return key;
    } else if (assignment.startsWith('key')) {
      // Specific OpenAI key (key1, key2, etc)
      const keyNum = assignment.replace('key', '');
      const key = localStorage.getItem(`openai_api_key${keyNum}`);
      if (key) return key;
    }

    // Fallback: Try to get any available key before returning demo
    const fallbackKey = this.getAnyAvailableKey(provider);
    if (fallbackKey) return fallbackKey;

    // Last resort: Return demo key
    console.warn('⚠️ No API keys found - using demo mode');
    return 'demo-key-no-api-needed';
  },

  /**
   * Get a rotating OpenAI key (load balancing)
   */
  getRotatingOpenAIKey() {
    const lastUsed = parseInt(localStorage.getItem('last_openai_key') || '0');

    // Try next 4 keys in rotation
    for (let i = 1; i <= 4; i++) {
      const keyIndex = ((lastUsed + i - 1) % 4) + 1;
      const key = localStorage.getItem(`openai_api_key${keyIndex}`);
      if (key) {
        localStorage.setItem('last_openai_key', keyIndex.toString());
        this.trackKeyUsage(keyIndex);
        return key;
      }
    }

    return null;
  },

  /**
   * Get any available key for the specified provider
   */
  getAnyAvailableKey(provider = 'openai') {
    if (provider === 'openai') {
      for (let i = 1; i <= 4; i++) {
        const key = localStorage.getItem(`openai_api_key${i}`);
        if (key) return key;
      }
    } else if (provider === 'claude') {
      return localStorage.getItem('claude_api_key');
    } else if (provider === 'gemini') {
      return localStorage.getItem('gemini_api_key');
    }
    return null;
  },

  /**
   * Get all available OpenAI keys
   */
  getAllOpenAIKeys() {
    const keys = [];
    for (let i = 1; i <= 4; i++) {
      const key = localStorage.getItem(`openai_api_key${i}`);
      if (key) keys.push({ index: i, key });
    }
    return keys;
  },

  /**
   * Track API key usage
   */
  trackKeyUsage(keyIndex) {
    const currentUsage = parseInt(
      localStorage.getItem(`key${keyIndex}_usage`) || '0'
    );
    localStorage.setItem(`key${keyIndex}_usage`, (currentUsage + 1).toString());

    const totalCalls = parseInt(localStorage.getItem('total_api_calls') || '0');
    localStorage.setItem('total_api_calls', (totalCalls + 1).toString());
  },

  /**
   * Check if app is premium (has master admin or beta license)
   */
  isPremium() {
    const masterAdmin =
      localStorage.getItem('master_admin') === 'TROY_WALKER_2026';
    const betaLicense = localStorage.getItem('beta_license') === 'active';
    const hasAppLicense = localStorage.getItem('papi_license') === 'active';
    return masterAdmin || betaLicense || hasAppLicense;
  },

  /**
   * Check if specific app license exists
   */
  hasLicense(appName) {
    appName = appName || this.getCurrentApp();
    const licenseName =
      appName.replace('.html', '').replace(/-/g, '_') + '_license';
    return localStorage.getItem(licenseName) === 'active';
  },

  /**
   * Validate API key format
   */
  validateKey(key, provider = 'openai') {
    if (!key) return false;

    if (provider === 'openai') {
      return key.startsWith('sk-');
    } else if (provider === 'claude') {
      return key.startsWith('sk-ant-');
    } else if (provider === 'gemini') {
      return key.startsWith('AIza');
    }

    return false;
  },

  /**
   * Get fallback key if primary fails (for error handling)
   */
  getFallbackKey(usedKey) {
    for (let i = 1; i <= 4; i++) {
      const key = localStorage.getItem(`openai_api_key${i}`);
      if (key && key !== usedKey) {
        this.trackKeyUsage(i);
        return key;
      }
    }
    return null;
  },

  /**
   * Show key setup instructions if no keys found
   */
  showKeySetupPrompt() {
    const hasKeys =
      this.getAnyAvailableKey('openai') ||
      this.getAnyAvailableKey('claude') ||
      this.getAnyAvailableKey('gemini');

    if (!hasKeys) {
      console.log(
        'ℹ️ Running in demo mode. Configure API keys in Key Controller for full features.'
      );
      // Enable demo mode automatically
      localStorage.setItem('demo_mode', 'true');
      return true;
    }
    return false;
  },

  /**
   * Open Key Controller in new tab
   */
  openKeyController() {
    window.open('key-controller.html', '_blank');
  },

  /**
   * Get key statistics
   */
  getStats() {
    return {
      totalCalls: parseInt(localStorage.getItem('total_api_calls') || '0'),
      key1Usage: parseInt(localStorage.getItem('key1_usage') || '0'),
      key2Usage: parseInt(localStorage.getItem('key2_usage') || '0'),
      key3Usage: parseInt(localStorage.getItem('key3_usage') || '0'),
      key4Usage: parseInt(localStorage.getItem('key4_usage') || '0'),
      currentApp: this.getCurrentApp(),
      assignment:
        localStorage.getItem(`assign-${this.getCurrentApp()}`) || 'auto',
    };
  },

  /**
   * Quick check - verify keys are loaded
   */
  checkKeys() {
    const openaiKeys = [];
    for (let i = 1; i <= 4; i++) {
      const key = localStorage.getItem(`openai_api_key${i}`);
      if (key) openaiKeys.push(`Key ${i}: ${key.substring(0, 15)}...`);
    }

    const claude = localStorage.getItem('claude_api_key');
    const gemini = localStorage.getItem('gemini_api_key');
    const demoMode = localStorage.getItem('demo_mode') === 'true';
    const currentKey = this.loadKey();

    console.log('🔑 PAPI Key Status:');
    console.log('==================');
    console.log(`OpenAI Keys: ${openaiKeys.length}/4 configured`);
    openaiKeys.forEach((k) => console.log(`  - ${k}`));
    console.log(
      `Claude Key: ${claude ? claude.substring(0, 20) + '...' : '❌ Not set'}`
    );
    console.log(
      `Gemini Key: ${gemini ? gemini.substring(0, 15) + '...' : '❌ Not set'}`
    );
    console.log(`Demo Mode: ${demoMode ? '⚠️ ENABLED' : '✅ Disabled'}`);
    console.log(
      `Current Key: ${currentKey ? currentKey.substring(0, 20) + '...' : '❌ None'}`
    );
    console.log(
      `Master Admin: ${localStorage.getItem('master_admin') === 'TROY_WALKER_2026' ? '👑 ACTIVE' : '❌ Inactive'}`
    );

    return {
      openaiCount: openaiKeys.length,
      hasClaude: !!claude,
      hasGemini: !!gemini,
      demoMode,
      currentKey: currentKey ? currentKey.substring(0, 20) + '...' : null,
    };
  },
};

// Auto-initialize and show prompt if needed
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (PAPI.showKeySetupPrompt()) {
      console.log('👋 Welcome! Set up your API keys here: key-controller.html');
    } else {
      console.log(
        '✅ PAPI Key Loader ready. Current app:',
        PAPI.getCurrentApp()
      );
      console.log('📊 API Stats:', PAPI.getStats());
    }
  });
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PAPI;
}
