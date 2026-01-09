# PAPI Central - High Availability System
## Multi-Server Failover & Data Sync

---

## 🎯 System Overview

PAPI Central now has **bulletproof reliability** with:
- ✅ Multi-server failover (Render → Netlify → Vercel → GitHub → Local)
- ✅ Automatic health monitoring (30-second checks)
- ✅ Cross-device data synchronization
- ✅ Offline mode with Service Worker
- ✅ Zero data loss with auto-backup
- ✅ Admin health dashboard

---

## 📂 New Files Created

### Core System Files

1. **papi-failover.js** (350 lines)
   - Smart server switching
   - Health check monitoring
   - Failover event tracking
   - 5 server fallback chain

2. **papi-sync.js** (280 lines)
   - GitHub Gist backup
   - Auto-sync every 60 seconds
   - Cross-device synchronization
   - Export/import local backups

3. **health-monitor.html** (500 lines)
   - Real-time server dashboard
   - Response time graphs
   - Manual server switching
   - Sync status display

4. **service-worker.js** (150 lines)
   - Offline mode support
   - App shell caching
   - Network-first strategy

5. **offline.html**
   - Friendly offline page
   - Retry connection button

### Configuration Files

6. **render.yaml** - Render deployment config
7. **vercel.json** - Vercel deployment config
8. **netlify.toml** (updated) - Netlify deployment config
9. **health.json** - Health check endpoint

---

## 🚀 Deployment Instructions

### Option 1: Deploy to Render (Primary)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add high availability system"
   git push origin main
   ```

2. **In Render Dashboard:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repo
   - Build Command: `echo "No build needed"`
   - Publish Directory: `.`
   - Click "Create Static Site"

3. **Your URL:** `https://papi-central.onrender.com`

### Option 2: Deploy to Netlify (Secondary)

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import existing project"
   - Connect GitHub repo
   - Netlify auto-detects netlify.toml

2. **Your URL:** `https://papi-central.netlify.app`

### Option 3: Deploy to Vercel (Tertiary)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Vercel auto-detects vercel.json

2. **Your URL:** `https://papi-central.vercel.app`

### Option 4: GitHub Pages (Backup)

1. **Enable GitHub Pages:**
   - Repo Settings → Pages
   - Source: "Deploy from branch"
   - Branch: `main` / `root`
   - Save

2. **Your URL:** `https://yourusername.github.io/papi-central`

---

## 🔧 Setup Instructions

### Step 1: Update Server URLs

Edit **papi-failover.js** (lines 5-30) with your actual deployment URLs:

```javascript
const PAPI_SERVERS = {
    primary: {
        name: 'Render',
        url: 'https://YOUR-SITE.onrender.com',  // ← Change this
        healthCheck: 'https://YOUR-SITE.onrender.com/health.json'
    },
    secondary: {
        name: 'Netlify',
        url: 'https://YOUR-SITE.netlify.app',   // ← Change this
        healthCheck: 'https://YOUR-SITE.netlify.app/health.json'
    },
    tertiary: {
        name: 'Vercel',
        url: 'https://YOUR-SITE.vercel.app',    // ← Change this
        healthCheck: 'https://YOUR-SITE.vercel.app/health.json'
    }
};
```

### Step 2: Enable Service Worker

Add to **index.html** (in `<head>` section):

```html
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('✅ Offline mode enabled'))
        .catch(err => console.error('❌ Service Worker error:', err));
}
</script>
```

### Step 3: Load Failover System

Add to **index.html** (before closing `</body>`):

```html
<script src="papi-failover.js"></script>
<script src="papi-sync.js"></script>
```

### Step 4: Configure Data Sync (Optional)

1. **Create GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select scope: `gist` (create and read gists)
   - Copy token

2. **Configure in browser console:**
   ```javascript
   await window.PAPISync.configureSync('YOUR_GITHUB_TOKEN');
   ```

   This creates a private gist for backups.

---

## 🎮 Usage Guide

### Access Health Monitor

Open: **http://localhost:8001/health-monitor.html** (or your deployed URL)

**Features:**
- Real-time server status
- Response time monitoring
- Manual server switching
- Failover history
- Data sync controls

### Monitor Failover

The system automatically:
1. Checks all servers every 30 seconds
2. Switches to backup if primary fails
3. Records failover events
4. Notifies you of server changes

### Export/Import Backups

**Export:**
```javascript
window.PAPISync.exportBackup();
```
Downloads: `papi-backup-[timestamp].json`

**Import:**
1. Open Health Monitor
2. Click "Export Backup" to get a file
3. Save it somewhere safe
4. To restore, create an import button or use console:
```javascript
// In console, after selecting file
const file = document.querySelector('input[type=file]').files[0];
await window.PAPISync.importBackup(file);
```

---

## 🔐 Security Notes

**⚠️ Never commit:**
- GitHub personal access tokens
- API keys
- Gist IDs (if private data)

**✅ Safe to commit:**
- All system files (papi-failover.js, papi-sync.js, etc.)
- Configuration files (render.yaml, vercel.json, etc.)
- Health monitor dashboard

---

## 📊 How It Works

### Failover Chain

```
Primary (Render) → fails?
  ↓
Secondary (Netlify) → fails?
  ↓
Tertiary (Vercel) → fails?
  ↓
GitHub Pages → fails?
  ↓
Local Dev (localhost)
```

### Data Flow

```
User makes change in app
  ↓
localStorage updated
  ↓
PAPISync detects change
  ↓
Waits 60 seconds
  ↓
Syncs to GitHub Gist
  ↓
Other devices pull update
```

### Health Checks

Every 30 seconds:
1. Ping all servers at `/health.json`
2. Measure response time
3. Update status (online/offline)
4. If current server offline → switch to best available
5. Update dashboard display

---

## 🎨 Customization

### Change Check Intervals

Edit **papi-failover.js** line 15:
```javascript
this.checkInterval = 30000; // 30 seconds (change to any milliseconds)
```

Edit **papi-sync.js** line 11:
```javascript
this.syncInterval = 60000; // 1 minute (change to any milliseconds)
```

### Add More Servers

Add to **papi-failover.js** PAPI_SERVERS object:
```javascript
custom: {
    name: 'My Custom Server',
    url: 'https://my-custom.com',
    priority: 3,
    healthCheck: 'https://my-custom.com/health.json'
}
```

### Customize Offline Page

Edit **offline.html** to match your branding.

---

## 🐛 Troubleshooting

**Problem: Health Monitor shows all servers offline**

Solution:
1. Check if health.json exists in your deployment
2. Verify CORS is enabled (it is by default)
3. Open browser DevTools → Network tab
4. Refresh health monitor
5. Check for 404 or CORS errors

**Problem: Data sync not working**

Solution:
1. Verify GitHub token has `gist` permission
2. Check console for error messages
3. Test manually: `await window.PAPISync.syncToCloud()`
4. If error, regenerate token with correct permissions

**Problem: Service Worker not caching**

Solution:
1. Check if site is HTTPS (required for Service Worker)
2. Open DevTools → Application → Service Workers
3. Check registration status
4. Try "Unregister" then reload page

**Problem: Failover not switching automatically**

Solution:
1. Wait 30 seconds (automatic check interval)
2. Open Health Monitor to see real-time status
3. Check console for failover messages
4. Manually trigger: `await window.PAPIFailover.manualHealthCheck()`

---

## 📱 Access from Any Device

Once deployed:

**From iPad:**
- Open Safari → `https://papi-central.onrender.com`
- Tap Share → "Add to Home Screen"
- Launches like native app!

**From iPhone:**
- Same as iPad

**From Laptop:**
- Any browser → your deployment URL
- Data syncs automatically via GitHub Gist

**From Other Computers:**
- Sign in with admin credentials
- Data automatically restores from cloud

---

## 🎉 Benefits

1. **Zero Downtime:** If one server crashes, automatically switches
2. **Bulletproof:** 5-server fallback chain
3. **Cross-Device:** Work anywhere, data follows you
4. **Offline Mode:** Core features work without internet
5. **Real-Time Monitoring:** Know server status instantly
6. **Auto-Backup:** Never lose data (syncs every minute)
7. **Professional:** Same system used by major companies

---

## 📈 Next Steps

1. Deploy to all 3 platforms (Render, Netlify, Vercel)
2. Update server URLs in papi-failover.js
3. Test failover by turning off Render
4. Configure GitHub Gist sync
5. Add Service Worker to index.html
6. Share deployment URLs!

---

## 🔗 Quick Links

- **Health Monitor:** [/health-monitor.html](/health-monitor.html)
- **Admin Unlock:** [/unlock-admin.html](/unlock-admin.html)
- **Landing Page:** [/landing.html](/landing.html)
- **Offline Page:** [/offline.html](/offline.html)

---

**PAPI Central is now enterprise-grade! 🚀**
