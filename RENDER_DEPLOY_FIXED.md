# PAPI Central - Render Deployment Guide (FIXED)

## Quick Deploy to Render

### Option 1: Simple Static Site (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Fixed Render deployment configuration"
git push origin main
```

2. **Create Render Service**:
   - Go to https://render.com
   - Click **New** → **Static Site**
   - Connect your GitHub repo
   - Configure:
     - **Name**: `papi-central`
     - **Branch**: `main`
     - **Build Command**: Leave empty or `echo "No build"`
     - **Publish Directory**: `.` (root)
   - Click **Create Static Site**

3. **Done!** Your site will be live at: `https://papi-central.onrender.com`

---

## Option 2: Blueprint Deploy (All Services)

Use the `render.yaml` file for automatic deployment:

1. **Push to GitHub** (if not done)

2. **Create Blueprint**:
   - Go to https://dashboard.render.com/blueprints
   - Click **New Blueprint Instance**
   - Connect your GitHub repo
   - Select `render.yaml`
   - Click **Apply**

3. **Services Created**:
   - ✅ **papi-central** (static site) - Main apps
   - ⚠️ **papi-cortex-api** (Python) - Optional backend
   - ⚠️ **papi-payment-api** (Node.js) - Optional payments

---

## Fixes Applied

### 1. **render.yaml** - Fixed Configuration
- Changed `env: static` → `runtime: static`
- Simplified routes for better compatibility
- Fixed cache headers for .js/.css files
- Added proper fallback routing

### 2. **_redirects** - Native Routing
- Render/Netlify compatible redirects
- Health check endpoint: `/health`
- SPA fallback for all routes
- Direct serving of HTML files

### 3. **health.json** - Health Check
- Updated status endpoint
- Used by Render for uptime monitoring
- Returns service metadata

---

## Environment Variables (Optional)

### For Cortex API (Python):
```
PYTHON_VERSION=3.11.0
PORT=5000
OPENAI_API_KEY=sk-your-key-here
```

### For Payment API (Node.js):
```
NODE_VERSION=18
PORT=3000
STRIPE_SECRET_KEY=sk_test_your-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
```

---

## Troubleshooting

### Issue: "Build Failed"
**Solution**: For static sites, set Build Command to empty or `echo "No build"`

### Issue: "404 on routes"
**Solution**: The `_redirects` file handles this. Ensure it's in the root directory.

### Issue: "Python/Node services failing"
**Solution**: These are optional. You can disable them in render.yaml or ignore if not using backend features.

### Issue: "CORS errors"
**Solution**: Add these headers in render.yaml (already included):
```yaml
headers:
  - path: /*
    name: Access-Control-Allow-Origin
    value: "*"
```

---

## Testing Your Deployment

After deployment, test these URLs:

1. **Main App**: `https://your-site.onrender.com/`
2. **Health Check**: `https://your-site.onrender.com/health`
3. **Alien AI**: `https://your-site.onrender.com/index.html`
4. **Cortex Studio**: `https://your-site.onrender.com/cortex-app-studio.html`
5. **Aegis Guard**: `https://your-site.onrender.com/aegis-guard.html`

---

## Custom Domain (Optional)

1. Go to your Render service
2. Click **Settings** → **Custom Domain**
3. Add your domain: `papicentral.com`
4. Update DNS records as shown
5. SSL automatically provisioned

---

## Auto-Deploy (Continuous Deployment)

Render automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update PAPI Central"
git push origin main
```

Wait 2-3 minutes → Live! 🚀

---

## Performance Tips

1. **Free Tier**: Spins down after 15 min inactivity
   - First request may take 30-60 seconds
   - Subsequent requests are fast

2. **Upgrade to Pro**: $7/month for always-on

3. **Use CDN**: Enable Render's CDN in settings for faster global delivery

---

## Support

- **Render Docs**: https://render.com/docs/static-sites
- **PAPI Issues**: Check console for errors
- **API Keys**: Store in localStorage via Key Controller

✅ **Deployment Fixed and Ready!**
