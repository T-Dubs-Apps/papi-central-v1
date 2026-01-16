// file-arranger-dragdrop.js
// Drag & drop file arranger for online deployed app filesystems

const dropZone = document.getElementById('dropZone');
const dropText = document.getElementById('dropText');
const statusDiv = document.getElementById('status');
const pauseBtn = document.getElementById('pauseBtn');
const unpauseBtn = document.getElementById('unpauseBtn');

let paused = false;
let files = [];

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('bg-blue-900');
  dropText.textContent = 'Release to drop files';
});

dropZone.addEventListener('dragleave', (e) => {
  dropZone.classList.remove('bg-blue-900');
  dropText.textContent = 'Drop files here';
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropZone.classList.remove('bg-blue-900');
  files = Array.from(e.dataTransfer.files);
  statusDiv.textContent = files.length + ' files dropped.';
  if (paused) {
    statusDiv.textContent += ' App is paused. You can replace files.';
  }
  // Arrange and zip files
  if (files.length) {
    statusDiv.textContent += ' Arranging files...';
    const categorized = {};
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      let cat = 'Other';
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext))
        cat = 'Images';
      else if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext))
        cat = 'Videos';
      else if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext))
        cat = 'Audio';
      else if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(ext))
        cat = 'Documents';
      else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext))
        cat = 'Archives';
      else if (
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
        cat = 'Code';
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(file);
    }
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
  }
});

pauseBtn.addEventListener('click', () => {
  paused = true;
  statusDiv.textContent =
    'Deployed app paused. You can drag files away or drop new files to replace.';
});

unpauseBtn.addEventListener('click', () => {
  paused = false;
  statusDiv.textContent = 'Deployed app unpaused. Normal operation resumed.';
});
