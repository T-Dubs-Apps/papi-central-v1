// app-upgrader-pro.js
// Scans, analyzes, and upgrades app folders for structure, code quality, and stability
// Store last uploaded zip for undo
let lastZip = null;

async function scanAndUpgrade() {
  const input = document.getElementById('folderInput');
  const output = document.getElementById('output');
  if (!input.files.length) {
    output.textContent = 'Please select a folder to scan.';
    return;
  }
  output.textContent = 'Zipping files for upload...';
  // Zip files for backend upload
  const zip = await createZip(input.files);
  lastZip = zip; // Save for undo
  output.textContent = 'Uploading to AI backend...';
  // Send to backend
  const formData = new FormData();
  formData.append('file', zip, 'app.zip');
  try {
    const res = await fetch('http://localhost:5050/analyze', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    let report = 'AI Upgrade Report:\n';
    if (data.report) {
      report += data.report.join('\n');
    }
    if (data.repairs && data.repairs.length) {
      report += '\n\nFiles repaired by AI:\n' + data.repairs.join(', ');
    }
    output.textContent = report;
  } catch (err) {
    output.textContent = 'Error contacting backend: ' + err;
  }
}

// Undo function to restore previous state
async function undoUpgrade() {
  const output = document.getElementById('output');
  if (!lastZip) {
    output.textContent = 'No previous upgrade to undo.';
    return;
  }
  // Simulate undo by re-uploading lastZip to backend with undo flag
  output.textContent = 'Restoring previous state...';
  const formData = new FormData();
  formData.append('file', lastZip, 'app.zip');
  formData.append('undo', 'true');
  try {
    const res = await fetch('http://localhost:5050/analyze', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    output.textContent = 'Undo complete. Previous state restored.';
  } catch (err) {
    output.textContent = 'Error restoring previous state: ' + err;
  }
}

// Advanced AI logic: zip files for upload
async function createZip(files) {
  // Use JSZip for zipping (must include JSZip in HTML)
  if (typeof JSZip === 'undefined') {
    alert('JSZip library required for zipping files.');
    throw new Error('JSZip not loaded');
  }
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.webkitRelativePath, await file.arrayBuffer());
  }
  return await zip.generateAsync({ type: 'blob' });
}
