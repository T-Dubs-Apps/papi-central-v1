// file-arranger-pro.js
// Arranges and separates mixed files/folders from user selection into a new organized folder

// Utility: classify file by extension
function getFileCategory(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext))
    return 'Images';
  if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) return 'Videos';
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) return 'Audio';
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(ext))
    return 'Documents';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'Archives';
  if (
    [
      'js',
      'ts',
      'py',
      'java',
      'cpp',
      'c',
      'cs',
      'html',
      'css',
      'json',
      'xml',
      'sh',
      'bat',
    ].includes(ext)
  )
    return 'Code';
  return 'Other';
}

// UI Elements
const folderInput = document.getElementById('folderInput');
const arrangeBtn = document.getElementById('arrangeBtn');
const statusDiv = document.getElementById('status');

let files = [];
folderInput.addEventListener('change', (e) => {
  files = Array.from(e.target.files);
  statusDiv.textContent = files.length + ' files/folders selected.';
});

arrangeBtn.addEventListener('click', async () => {
  if (!files.length) {
    statusDiv.textContent = 'Please select a folder first.';
    return;
  }
  statusDiv.textContent = 'Arranging files...';

  // Group files by category
  const categorized = {};
  for (const file of files) {
    if (file.webkitRelativePath) {
      // Only process files, not folders
      const cat = getFileCategory(file.name);
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(file);
    }
  }

  // Create a zip of arranged folders
  try {
    const JSZip =
      await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm');
    const zip = new JSZip.default();
    const appFolder = 'Arranged-File-Arranger-Pro';
    for (const cat in categorized) {
      const folder = zip.folder(appFolder + '/' + cat);
      for (const file of categorized[cat]) {
        const data = await file.arrayBuffer();
        folder.file(file.name, data);
      }
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = appFolder + '.zip';
    a.click();
    statusDiv.textContent = 'Arranged files are ready! Download started.';
  } catch (e) {
    statusDiv.textContent = 'Error arranging files: ' + e.message;
  }
});
