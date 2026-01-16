# PAPI Central Trial System - Documentation

## Overview
Complete trial and licensing system for sharing Alien AI Assistant and Cortex App Studio with iOS/Android compatibility, request tracking, surveys, and admin controls.

## Components

### 1. Trial Activation Page (`trial-activate.html`)
**Purpose**: Users activate free trials via shareable links  
**Features**:
- Email/phone/name collection
- 30-day trial period
- 30 requests per app (Alien AI + Cortex)
- Prevents duplicate activations
- Auto-redirects to apps after activation

**URL Format**:
```
https://yoursite.com/trial-activate.html?key=TRIAL-xxx&apps=alien,cortex&limit=30&type=free
```

### 2. Admin Link Generator (`trial-link-generator.html`)
**Purpose**: Admin interface for creating shareable trial links  
**Admin Email**: `mr.troy.walker.62@gmail.com`  
**Features**:
- Generate free trial links
- Set custom request limits (1-1000)
- Choose which apps to include
- View active trials statistics
- Copy/email links directly
- iOS & Android compatible links

**Access**: Requires admin email authentication

### 3. Trial Management System (`trial-system.js`)
**Purpose**: Core request tracking, surveys, and license management  
**Key Features**:

#### Request Tracking
- Tracks requests per app (alien/cortex)
- Shows live counter in UI
- Blocks requests when limit reached
- Auto-upgrades admin users

#### Survey System
- Triggers after 10th request
- 4 rating categories (1-5 stars):
  * Power & Capabilities
  * Ease of Use
  * Stability & Reliability
  * Overall Satisfaction
- Optional feedback text
- **Reward**: 20 additional requests after submission

#### Admin Bypass
- Email `mr.troy.walker.62@gmail.com` = unlimited access
- No request tracking
- No surveys required
- Full feature access

#### User Protection
- Code access blocked (users can't view/steal source)
- Generated apps fully accessible
- Trial data in localStorage only
- One trial per email address

## Implementation

### Integrated Into:
1. **Cortex App Studio** (`cortex-app-studio.html`)
   - Line 8: `<script src="trial-system.js"></script>`
   - Request check before app generation
   - Counter display in top-right

2. **Alien AI Assistant** (`index.html`)
   - Line 11: `<script src="trial-system.js"></script>`
   - Request check before AI responses
   - Counter display in top-right

## Usage Workflows

### For Administrators (Troy Walker):
1. Visit: `trial-link-generator.html`
2. Login with admin email
3. Select trial type:
   - **Free Trial**: 30 days, 30 requests
   - **Paid License**: Custom duration
   - **Admin Access**: Unlimited
4. Choose apps (Alien AI, Cortex, or both)
5. Set request limit
6. Click "Generate Link"
7. Copy link or share via email
8. Monitor active trials in dashboard

### For End Users:
1. Receive trial link via email/text
2. Click link → opens `trial-activate.html`
3. Enter email, phone (optional), name
4. Click "Activate Free Trial"
5. Redirected to apps
6. Use apps (requests tracked)
7. After 10 requests → Survey appears
8. Complete survey → Get 20 more requests
9. After 30 total requests → Upgrade prompt

## Data Storage

### localStorage Keys:
```javascript
// Trial Data
'trial_{email}' = {
  email, phone, name,
  trialKey, apps: ['alien', 'cortex'],
  createdAt, expiresAt,
  requestsRemaining: { alien: 30, cortex: 30 },
  surveyCompleted: false,
  active: true
}

// Current User
'current_trial_user' = 'user@email.com'
'trial_license' = 'active'

// App-Specific
'alien_trial_requests' = '30'
'alien_trial_expiry' = '2026-02-08T...'
'cortex_trial_requests' = '30'
'cortex_trial_expiry' = '2026-02-08T...'

// Survey Results
'trial_surveys' = [{
  app: 'alien',
  timestamp, power, ease, stability, overall, feedback
}, ...]

// Generated Links (Admin)
'trial_links' = [{
  key: 'TRIAL-xxx',
  type: 'free', apps: ['alien', 'cortex'],
  limit: 30, createdAt, createdBy, usedBy, active
}, ...]

// Admin Override
'master_admin' = 'TROY_WALKER_2026'
```

## Mobile Compatibility

### iOS Support ✅
- Safari compatible
- localStorage works
- Web Speech API (voice input)
- File download via share sheet

### Android Support ✅
- Chrome/Edge compatible
- localStorage works
- Web Speech API (voice input)
- File download to Downloads folder

## Security Features

1. **Admin-Only Link Generation**
   - Email verification required
   - No public access to generator

2. **One Trial Per Email**
   - Duplicate prevention
   - Email validation

3. **Code Protection**
   - Users can't access source
   - Generated apps are standalone
   - No "View Source" exploit risk

4. **Trial Expiration**
   - 30-day hard limit
   - Auto-expiry checks
   - Graceful upgrade prompts

## Sharing Options

### Free Trial Link:
```
✅ 30 days access
✅ 30 requests per app
✅ Survey → 20 more requests
✅ Unlimited generated app usage
```

### Admin Access Link:
```
✅ Unlimited everything
✅ No request tracking
✅ No surveys
✅ Full code access
```

### Paid License Link:
```
✅ Custom duration
✅ Custom request limit
✅ Premium features
✅ Priority support
```

## Testing URLs

**Local Testing**:
```
http://localhost:8000/trial-activate.html?key=TRIAL-TEST123&apps=alien,cortex
http://localhost:8000/trial-link-generator.html
```

**Production**:
```
https://papicentral.com/trial-activate.html?key=TRIAL-xxx&apps=alien,cortex
https://papicentral.com/trial-link-generator.html
```

## Upgrade Paths

When users hit limits:
1. **30 requests used** → "Upgrade for unlimited" prompt
2. **Trial expired** → "Your trial has ended" + upgrade link
3. **Blocked request** → Redirect to `PAPI Central.htm` (marketplace)

## Admin Dashboard Features

View in `trial-link-generator.html`:
- Total active trials
- Requests remaining per user
- Expiration dates
- Survey completion status
- Generated link history

## Survey Results Export

Access saved surveys:
```javascript
const surveys = JSON.parse(localStorage.getItem('trial_surveys') || '[]');
console.table(surveys);
```

Export to CSV:
```javascript
const csv = surveys.map(s => 
  `${s.app},${s.power},${s.ease},${s.stability},${s.overall},"${s.feedback}"`
).join('\n');
console.log('App,Power,Ease,Stability,Overall,Feedback\n' + csv);
```

## Future Enhancements

Planned features:
- Backend database sync
- Email notifications (trial expiry)
- Usage analytics dashboard
- A/B testing for surveys
- Referral link tracking
- Team trial management

## Support

**Admin Contact**: mr.troy.walker.62@gmail.com  
**Documentation**: This file  
**Issues**: Check localStorage for debugging
