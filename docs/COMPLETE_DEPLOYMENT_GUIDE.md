# Complete PAPI Central Deployment Guide
## Frontend + Python Server + Stripe Server

---

## 🏗️ THE ARCHITECTURE:

### **What Goes Where:**

1. **GitHub Pages** (FREE) → Your HTML/CSS/JS files
   - index.html, cortex-app-studio.html, about-troy.html, etc.
   - All your LAUNCH-*.html files
   - papi-key-loader.js
   - Everything static

2. **Render.com** (FREE) → Your Python AI Server
   - cortex_server.py
   - The_Cortex.py
   - requirements.txt
   
3. **Render.com or Vercel** (FREE) → Your Stripe/Node Server
   - server.js
   - package.json

---

## 📦 DEPLOYMENT PLAN:

### **STEP 1: Deploy Frontend to GitHub Pages (15 min)**

1. Create GitHub account at https://github.com
2. Create new repository: "papi-central"
3. Upload all HTML/CSS/JS files
4. Enable GitHub Pages in Settings → Pages
5. Your site goes live at: `https://[username].github.io/papi-central/`

**Files to upload:**
```
index.html
cortex-app-studio.html
cortex-desktop-bridge.html
about-troy.html
PAPI Central.htm
All LAUNCH-*.html files
papi-key-loader.js
```

---

### **STEP 2: Deploy Python AI Server to Render (20 min)**

**Why Render?**
- Free tier available
- Supports Python
- Easy deployment
- Auto-restarts

**Steps:**

1. **Go to https://render.com**
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub account
5. Select your repository
6. Configure:
   - **Name:** `papi-cortex-server`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python cortex_server.py`
   - **Plan:** Free

7. Click "Create Web Service"
8. Wait 3-5 minutes for deployment
9. You get a URL like: `https://papi-cortex-server.onrender.com`

**Update cortex-desktop-bridge.html:**
Change this line:
```javascript
const response = await fetch('http://localhost:5000/ask', {
```

To:
```javascript
const response = await fetch('https://papi-cortex-server.onrender.com/ask', {
```

---

### **STEP 3: Deploy Stripe Server to Render (20 min)**

**Option A: Render (Same as Python)**

1. Click "New +" → "Web Service"
2. Select repository
3. Configure:
   - **Name:** `papi-stripe-server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

4. Add Environment Variables:
   - STRIPE_SECRET_KEY: `your_stripe_secret_key`
   - STRIPE_PUBLISHABLE_KEY: `your_stripe_public_key`

5. You get URL: `https://papi-stripe-server.onrender.com`

**Option B: Vercel (Easier for Node.js)**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your repository
5. Vercel auto-detects Node.js
6. Add environment variables
7. Deploy!
8. URL: `https://papi-central.vercel.app`

---

## 🔗 CONNECTING EVERYTHING:

### **Your Final URLs:**

```
Frontend:     https://troywalker.github.io/papi-central/
AI Server:    https://papi-cortex-server.onrender.com
Stripe:       https://papi-stripe-server.onrender.com
```

### **Update Frontend to Call Servers:**

**In cortex-desktop-bridge.html:**
```javascript
// Replace localhost with your Render URL
const API_URL = 'https://papi-cortex-server.onrender.com';

fetch(`${API_URL}/ask`, { ... })
```

**In PAPI Central.htm (for Stripe):**
```javascript
// Replace localhost with your server URL
const STRIPE_API = 'https://papi-stripe-server.onrender.com';

fetch(`${STRIPE_API}/create-checkout-session`, { ... })
```

---

## 🎯 QUICK START (Do This Now):

### **Phase 1: Get Frontend Live (TODAY)**

```bash
# 1. Create GitHub repo
# 2. Upload all HTML files
# 3. Enable GitHub Pages
# 4. Share link on TikTok!
```

### **Phase 2: Add Python Server (TOMORROW)**

```bash
# 1. Create Render account
# 2. Deploy cortex_server.py
# 3. Update frontend to use new URL
```

### **Phase 3: Add Stripe (LATER)**

```bash
# 1. Deploy server.js to Render/Vercel
# 2. Add Stripe keys as environment variables
# 3. Update payment forms
```

---

## 💰 COSTS:

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| GitHub Pages | ✅ Unlimited | N/A |
| Render.com | ✅ 750 hours/month | $7/month |
| Vercel | ✅ 100GB bandwidth | $20/month |

**Total Cost to Start: $0/month** 🎉

---

## 🔥 THE SMART APPROACH:

**Week 1 (THIS WEEK):**
1. Deploy HTML files to GitHub Pages
2. Get your links working for TikTok
3. Start getting traffic

**Week 2:**
1. Deploy Python server to Render
2. Enable Cortex Desktop features
3. Test everything

**Week 3:**
1. Deploy Stripe server
2. Enable real payments
3. Start making money!

---

## 🛠️ FILES TO MODIFY:

### **1. cortex-desktop-bridge.html**
```javascript
// OLD:
const response = await fetch('http://localhost:5000/ask', {

// NEW:
const response = await fetch('https://papi-cortex-server.onrender.com/ask', {
```

### **2. cortex_server.py**
```python
# Add this at the top
import os

# Change host to allow external connections
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

### **3. server.js (Stripe)**
```javascript
// Add this
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

## 📋 CHECKLIST:

**Phase 1: Static Site (Do Today)**
- [ ] Create GitHub account
- [ ] Create repository
- [ ] Upload HTML files
- [ ] Enable GitHub Pages
- [ ] Update TikTok bio with link
- [ ] Test all pages work

**Phase 2: Python Server (Do This Week)**
- [ ] Create Render account
- [ ] Deploy cortex_server.py
- [ ] Get server URL
- [ ] Update frontend API calls
- [ ] Test Cortex Desktop works

**Phase 3: Payments (Do When Ready)**
- [ ] Deploy server.js
- [ ] Add Stripe keys
- [ ] Update payment forms
- [ ] Test purchases

---

## 🚀 START HERE (RIGHT NOW):

1. Go to https://github.com
2. Sign up / Sign in
3. Create new repository called "papi-central"
4. I'll help you upload files!

**Want me to walk you through GitHub step-by-step?** 

Or should I first update your server files to work with Render? 🎯
