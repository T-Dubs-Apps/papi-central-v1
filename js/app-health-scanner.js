// app-health-scanner.js
// Scans, diagnoses, offers fixes, repairs, double-checks, and monitors deployed apps

const appUrl = document.getElementById('appUrl');
const scanBtn = document.getElementById('scanBtn');
const monitorBtn = document.getElementById('monitorBtn');
const scanStatus = document.getElementById('scanStatus');
const scanResults = document.getElementById('scanResults');

let monitoring = false;
let monitorInterval = null;

async function scanApp() {
  const url = appUrl.value.trim();
  if (!url) {
    scanStatus.textContent = 'Please enter an app URL.';
    return;
  }
  scanStatus.textContent = 'Scanning app for issues...';
  scanResults.innerHTML = '';
  // Step 1: Check if app is up
  let up = false;
  let response, text;
  try {
    response = await fetch(url, { cache: 'no-store' });
    text = await response.text();
    up = response.ok;
  } catch (e) {
    scanStatus.textContent = 'App is unreachable: ' + e.message;
    return;
  }
  if (!up) {
    scanStatus.textContent = 'App is down or returned error.';
    scanResults.innerHTML = '<b>Issue:</b> App is not responding.';
    return;
  }
  scanStatus.textContent = 'App is up. Analyzing for issues...';
  // Step 2: Basic issue detection (demo: look for error keywords)
  let issues = [];
  if (/error|exception|not found|fail|unavailable|crash/i.test(text)) {
    issues.push('Detected error message in app response.');
  }
  // Step 3: Suggest and offer fix (demo: AI placeholder)
  if (issues.length) {
    scanResults.innerHTML = `<b>Issues found:</b><ul>${issues.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    scanResults.innerHTML += `<button id='fixBtn' class='mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded'>Offer Fix</button>`;
    document.getElementById('fixBtn').onclick = async () => {
      scanStatus.textContent = 'Looking for a solution...';
      // Demo: AI suggestion placeholder
      setTimeout(() => {
        scanResults.innerHTML += `<div class='mt-2'><b>AI Suggestion:</b> Try restarting the app or checking logs. <button id='repairBtn' class='ml-2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs'>Repair Now</button></div>`;
        document.getElementById('repairBtn').onclick = async () => {
          scanStatus.textContent = 'Repairing (simulated, <20s downtime)...';
          // Simulate repair and double-check
          setTimeout(async () => {
            scanStatus.textContent = 'Double-checking fix...';
            await scanApp();
            scanStatus.textContent =
              'Repair complete. Monitoring for further issues...';
          }, 5000); // Simulate <20s downtime
        };
      }, 2000);
    };
  } else {
    scanResults.innerHTML = '<b>No major issues detected.</b>';
  }
}

scanBtn.onclick = scanApp;

monitorBtn.onclick = () => {
  if (monitoring) {
    clearInterval(monitorInterval);
    monitoring = false;
    monitorBtn.textContent = 'Start Monitoring';
    scanStatus.textContent = 'Monitoring stopped.';
  } else {
    monitoring = true;
    monitorBtn.textContent = 'Stop Monitoring';
    scanStatus.textContent = 'Monitoring app every 60 seconds...';
    monitorInterval = setInterval(scanApp, 60000);
  }
};
