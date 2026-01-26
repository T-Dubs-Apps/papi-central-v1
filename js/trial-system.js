// Trial Request Tracking & System
// PAPI Central Tester Management

// Trial Management System
const TRIAL_CONFIG = {
  ADMIN_EMAIL: 'mr.troy.walker.62@gmail.com',
  INITIAL_CHATS: 10,
  INITIAL_BUILDS: 3,
  TOTAL_CHATS: 30, // Per app per month
  TOTAL_BUILDS: 6, // 2 per app
  BUILDS_PER_APP: 2,
  TRIAL_DAYS: 30,
  SOCIAL_SHARES_REQUIRED: 5,
};

class TrialManager {
  constructor(appName, isBuildAction = false) {
    this.appName = appName; // 'alien', 'cortex', or 'nokn'
    this.isBuildAction = isBuildAction; // true for app generation, false for chat
    this.currentUser = localStorage.getItem('current_trial_user');
    this.initTrial();
  }

  initTrial() {
    // Check if tester is admin
    const currentEmail = localStorage.getItem('current_user_email');
    if (
      currentEmail &&
      currentEmail.toLowerCase() === TRIAL_CONFIG.ADMIN_EMAIL
    ) {
      this.adminUser = true;
      return;
    }

    // Load trial data
    if (this.currentUser) {
      const trialData = JSON.parse(
        localStorage.getItem('trial_' + this.currentUser) || '{}'
      );
      this.trialData = trialData;

      // Check if trial expired
      if (trialData.expiresAt && new Date(trialData.expiresAt) < new Date()) {
        this.showExpiredMessage();
      }
    }
  }

  isAdmin() {
    return this.adminUser === true;
  }

  canMakeRequest() {
    if (this.isAdmin()) return true;

    if (!this.trialData || !this.trialData.active) {
      return false;
    }

    if (this.isBuildAction) {
      // Check builds remaining for this app
      const remaining = this.trialData.buildsRemaining[this.appName] || 0;
      return remaining > 0;
    } else {
      // Check chat sessions remaining for this app
      const remaining = this.trialData.chatsRemaining[this.appName] || 0;
      return remaining > 0;
    }
  }

  getRemainingBuilds() {
    if (this.isAdmin()) return 'Unlimited';
    return this.trialData?.buildsRemaining[this.appName] || 0;
  }

  getRemainingChats() {
    if (this.isAdmin()) return 'Unlimited';
    return this.trialData?.chatsRemaining[this.appName] || 0;
  }

  trackRequest() {
    if (this.isAdmin()) return true;

    if (!this.canMakeRequest()) {
      this.showUpgradePrompt();
      return false;
    }

    // Decrement builds or chats
    if (this.isBuildAction) {
      this.trialData.buildsRemaining[this.appName]--;
    } else {
      this.trialData.chatsRemaining[this.appName]--;
    }
    localStorage.setItem(
      'trial_' + this.currentUser,
      JSON.stringify(this.trialData)
    );

    // Update display
    this.updateRequestCounter();
    
    const totalChatsUsed =
      TRIAL_CONFIG.INITIAL_CHATS +
      20 -
      (this.trialData.chatsRemaining.alien +
        this.trialData.chatsRemaining.cortex +
        this.trialData.chatsRemaining.nokn);
    if 
    }

    return true;
  }

  updateRequestCounter() {
    const buildsCounter = document.getElementById('trialBuildsCounter');
    const chatsCounter = document.getElementById('trialChatsCounter');

    if (buildsCounter) {
      const remaining = this.getRemainingBuilds();
      buildsCounter.textContent = remaining === 'Unlimited' ? '∞' : remaining;

      if (remaining === 0 && remaining !== 'Unlimited') {
        buildsCounter.style.color = '#ef4444';
      } else if (remaining === 1 && remaining !== 'Unlimited') {
        buildsCounter.style.color = '#f59e0b';
      }
    }

    if (chatsCounter) {
      const remaining = this.getRemainingChats();
      chatsCounter.textContent = remaining === 'Unlimited' ? '∞' : remaining;

      if (remaining <= 5 && remaining !== 'Unlimited') {
        chatsCounter.style.color = '#ef4444';
      } else if (remaining <= 10 && remaining !== 'Unlimited') {
        chatsCounter.style.color = '#f59e0b';
      }
    }
  }

  showSurvey() {
    const modal = document.createElement('div');
    modal.id = 'trialSurvey';
    modal.style.cssText =
      'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';

    modal.innerHTML = `
            <div style="background:white;border-radius:20px;padding:40px;max-width:600px;width:100%;">
                <h2 style="font-size:28px;font-weight:bold;color:#667eea;margin-bottom:10px;">
                    <i class="fas fa-star" style="margin-right:10px;"></i>Quick Survey
                </h2>
                <p style="color:#64748b;margin-bottom:30px;">You've made 10 requests! Help us improve by rating your experience.</p>
                
                <form id="surveyForm">
                    <div style="margin-bottom:25px;">
                        <label style="display:block;font-weight:bold;margin-bottom:10px;color:#1e293b;">
                            Power & Capabilities
                        </label>
                        <div style="display:flex;gap:10px;">
                            ${[1, 2, 3, 4, 5]
                              .map(
                                (n) => `
                                <label style="flex:1;text-align:center;">
                                    <input type="radio" name="power" value="${n}" required style="display:block;margin:0 auto 5px;">
                                    <span style="font-size:12px;color:#64748b;">${n}</span>
                                </label>
                            `
                              )
                              .join('')}
                        </div>
                    </div>

                    <div style="margin-bottom:25px;">
                        <label style="display:block;font-weight:bold;margin-bottom:10px;color:#1e293b;">
                            Ease of Use
                        </label>
                        <div style="display:flex;gap:10px;">
                            ${[1, 2, 3, 4, 5]
                              .map(
                                (n) => `
                                <label style="flex:1;text-align:center;">
                                    <input type="radio" name="ease" value="${n}" required style="display:block;margin:0 auto 5px;">
                                    <span style="font-size:12px;color:#64748b;">${n}</span>
                                </label>
                            `
                              )
                              .join('')}
                        </div>
                    </div>

                    <div style="margin-bottom:25px;">
                        <label style="display:block;font-weight:bold;margin-bottom:10px;color:#1e293b;">
                            Stability & Reliability
                        </label>
                        <div style="display:flex;gap:10px;">
                            ${[1, 2, 3, 4, 5]
                              .map(
                                (n) => `
                                <label style="flex:1;text-align:center;">
                                    <input type="radio" name="stability" value="${n}" required style="display:block;margin:0 auto 5px;">
                                    <span style="font-size:12px;color:#64748b;">${n}</span>
                                </label>
                            `
                              )
                              .join('')}
                        </div>
                    </div>

                    <div style="margin-bottom:25px;">
                        <label style="display:block;font-weight:bold;margin-bottom:10px;color:#1e293b;">
                            Overall Satisfaction
                        </label>
                        <div style="display:flex;gap:10px;">
                            ${[1, 2, 3, 4, 5]
                              .map(
                                (n) => `
                                <label style="flex:1;text-align:center;">
                                    <input type="radio" name="overall" value="${n}" required style="display:block;margin:0 auto 5px;">
                                    <span style="font-size:12px;color:#64748b;">${n}</span>
                                </label>
                            `
                              )
                              .join('')}
                        </div>
                    </div>

                    <div style="margin-bottom:25px;">
                        <label style="display:block;font-weight:bold;margin-bottom:10px;color:#1e293b;">
                            Additional Feedback (Optional)
                        </label>
                        <textarea name="feedback" rows="3" 
                                  style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:8px;font-family:inherit;"
                                  placeholder="What could we improve?"></textarea>
                    </div>

                    <button type="submit" style="width:100%;padding:15px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;">
                        <i class="fas fa-paper-plane" style="margin-right:8px;"></i>Submit Survey (Step 1 of 2)
                    </button>
                    <p style="text-align:center;color:#64748b;font-size:13px;margin-top:10px;">
                        After survey: Share with 5 friends to unlock 3 more builds + 20 more chats!
                    </p>
                </form>
            </div>
        `;

    document.body.appendChild(modal);

    document.getElementById('surveyForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitSurvey(new FormData(e.target));
      modal.remove();
    });
  }

  submitSurvey(formData) {
    const surveyResults = {
      app: this.appName,
      timestamp: new Date().toISOString(),
      power: formData.get('power'),
      ease: formData.get('ease'),
      stability: formData.get('stability'),
      overall: formData.get('overall'),
      feedback: formData.get('feedback'),
    };

    // Save survey results
    let surveys = JSON.parse(localStorage.getItem('trial_surveys') || '[]');
    surveys.push(surveyResults);
    localStorage.setItem('trial_surveys', JSON.stringify(surveys));

    // Mark survey as completed
    this.trialData.surveyCompleted = true;
    localStorage.setItem(
      'trial_' + this.currentUser,
      JSON.stringify(this.trialData)
    );

    // Now require social sharing
    this.showSocialSharingPrompt();
  }

  showSocialSharingPrompt() {
    const modal = document.createElement('div');
    modal.style.cssText =
      'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;';

    modal.innerHTML = `
            <div style="background:white;border-radius:20px;padding:40px;max-width:600px;width:100%;">
                <h2 style="font-size:28px;font-weight:bold;color:#667eea;margin-bottom:10px;">
                    <i class="fas fa-share-alt" style="margin-right:10px;"></i>Share & Unlock!
                </h2>
                <p style="color:#64748b;margin-bottom:20px;">Share PAPI Central with 5 friends on social media to unlock:</p>
                
                <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px;margin-bottom:25px;">
                    <p style="color:#15803d;font-size:18px;font-weight:bold;margin-bottom:10px;">✨ Bonus Unlocks:</p>
                    <p style="color:#166534;">✅ 3 additional builds (1 per app)</p>
                    <p style="color:#166534;">✅ 20 additional chat sessions</p>
                    <p style="color:#166534;">✅ Total: 6 builds + 30 chats</p>
                </div>

                <p style="color:#475569;margin-bottom:20px;font-size:14px;">
                    Share your unique tester link on:<br>
                    Facebook, Twitter, Instagram, LinkedIn, or TikTok
                </p>

                <button onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied! Share on social media.');" 
                        style="width:100%;padding:15px;background:#3b82f6;color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;margin-bottom:10px;">
                    <i class="fas fa-copy" style="margin-right:8px;"></i>Copy Link to Share
                </button>

                <button onclick="document.getElementById('confirmShares').style.display='block';this.style.display='none';" 
                        style="width:100%;padding:15px;background:linear-gradient(135deg,#22c55e,#10b981);color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;">
                    <i class="fas fa-check-circle" style="margin-right:8px;"></i>I've Shared with 5 Friends
                </button>

                <div id="confirmShares" style="display:none;margin-top:15px;">
                    <p style="color:#64748b;margin-bottom:15px;font-size:14px;">Confirm you've shared on at least 5 social platforms/friends:</p>
                    <button onclick="window.trialManager.confirmSocialSharing(this.parentElement.parentElement.parentElement);" 
                            style="width:100%;padding:15px;background:#22c55e;color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;">
                        ✅ Confirm & Unlock Bonus
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  confirmSocialSharing(modal) {
    // Mark as shared and add bonus resources
    this.trialData.socialShared = true;

    // Add 1 build per app (3 total) and 20 chats distributed
    this.trialData.buildsRemaining.alien += 1;
    this.trialData.buildsRemaining.cortex += 1;
    this.trialData.buildsRemaining.nokn += 1;

    // Add 20 chats (distribute evenly)
    this.trialData.chatsRemaining.alien += 7;
    this.trialData.chatsRemaining.cortex += 7;
    this.trialData.chatsRemaining.nokn += 6;

    localStorage.setItem(
      'trial_' + this.currentUser,
      JSON.stringify(this.trialData)
    );

    modal.remove();
    alert(
      '🎉 Bonus Unlocked!\n\n✅ 3 more builds added\n✅ 20 more chat sessions added\n\nTotal: 6 builds + 30 chats. Thank you for sharing!'
    );
    this.updateRequestCounter();
  }

  showUpgradePrompt() {
    const resourceType = this.isBuildAction ? 'builds' : 'chat sessions';
    const message = this.trialData?.active
      ? `⚠️ No ${resourceType} remaining!\n\nComplete survey & share with friends, or upgrade to unlimited access.`
      : '⚠️ Tester trial expired!\n\nUpgrade to continue using this app.';

    if (!this.trialData.surveyCompleted) {
      alert(
        message + '\n\nComplete your feedback survey to unlock more resources!'
      );
    } else if (!this.trialData.socialShared) {
      alert(
        message +
          '\n\nShare with 5 friends on social media to unlock bonus resources!'
      );
    } else if (confirm(message + '\n\nGo to upgrade page?')) {
      window.location.href = 'PAPI Central.htm';
    }
  }

  showExpiredMessage() {
    alert(
      '⏰ Your tester trial has expired.\n\nThank you for testing PAPI Central!\n\nUpgrade to continue using premium features.'
    );
    if (confirm('Go to upgrade page?')) {
      window.location.href = 'PAPI Central.htm';
    }
  }

  addRequestCounter() {
    // Add builds and chats counter to UI
    const counterHtml = `
            <div id="trial-counter" style="position:fixed;top:20px;right:20px;background:rgba(102,126,234,0.9);color:white;padding:12px 20px;border-radius:10px;font-weight:bold;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
                <div style="margin-bottom:5px;">
                    <i class="fas fa-hammer" style="margin-right:8px;"></i>
                    Builds: <span id="trialBuildsCounter">${this.getRemainingBuilds()}</span>
                </div>
                <div>
                    <i class="fas fa-comments" style="margin-right:8px;"></i>
                    Chats: <span id="trialChatsCounter">${this.getRemainingChats()}</span>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML('beforeend', counterHtml);
  }
}

// Export for use in apps
window.TrialManager = TrialManager;
window.TRIAL_CONFIG = TRIAL_CONFIG;
