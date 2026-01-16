// app-integrity-scanner.js
// Scans all apps for integrity, creativity, usability, power, and more. Repairs and enhances as needed.

let scanBtn = document.getElementById('scanBtn');
const scanResults = document.getElementById('scanResults');
const repairBox = document.getElementById('repairBox');
const reminder = document.getElementById('reminder');
const statusDiv = document.getElementById('status');

let issuesFound = false;

// Use Flask backend for real scanning
async function scanAllApps() {
  scanResults.innerHTML = '<div>Scanning all apps...</div>';
  statusDiv.textContent = '';
  try {
    const resp = await fetch('http://localhost:5050/scan-apps');
    const data = await resp.json();
    const issues = data.issues || [];
    issuesFound = issues.length > 0;
    scanResults.innerHTML =
      '<b>Scan Results:</b><ul>' +
      issues
        .map(
          (i) =>
            `<li><b>${i.app}:</b> ${i.issue} <button class='ml-2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs' onclick='repairIssue("${i.app}", "${i.fix}")'>Repair</button></li>`
        )
        .join('') +
      '</ul>';
    if (issuesFound) {
      reminder.textContent =
        'Reminder: Issues found! Please review and repair.';
    }
  } catch (e) {
    scanResults.innerHTML = `<div>Error scanning apps: ${e.message}</div>`;
  }
}

window.repairIssue = async function (app, fix) {
  repairBox.innerHTML = `<div>Repairing <b>${app}</b>: ${fix}...</div>`;
  try {
    const resp = await fetch('http://localhost:5050/repair-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app, fix }),
    });
    const data = await resp.json();
    repairBox.innerHTML = `<div><b>${app}</b> repaired: ${fix} applied.</div>`;
    statusDiv.textContent = `${app} is now enhanced.`;
    scanResults
      .querySelectorAll('button')
      .forEach((btn) => (btn.disabled = true));
    reminder.textContent = '';
  } catch (e) {
    repairBox.innerHTML = `<div>Error repairing app: ${e.message}</div>`;
  }
};

scanBtn.onclick = scanAllApps;

// Reminder logic: show on page load if issues found last time
if (localStorage.getItem('appIntegrityReminder') === '1') {
  reminder.textContent = 'Reminder: Issues found! Please review and repair.';
}

// API key integration (real backend)
async function autoConfigureKeys(app, api_key) {
  try {
    const resp = await fetch('http://localhost:5050/configure-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app, api_key }),
    });
    const data = await resp.json();
    statusDiv.textContent = `API key configured for ${app}.`;
  } catch (e) {
    statusDiv.textContent = `Error configuring API key: ${e.message}`;
  }
}
window.autoConfigureKeys = autoConfigureKeys;
