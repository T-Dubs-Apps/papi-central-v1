#!/usr/bin/env node
// Standalone Universal Driver File Scan Tool
// Scans system board and searches for driver/device files on boot/reboot

const fs = require('fs');
const path = require('path');

const scanPaths = [
  'C:/Windows/System32/DriverStore/FileRepository',
  'C:/Windows/System32/drivers',
  'C:/Drivers',
  'C:/Program Files',
  'C:/Program Files (x86)',
  'C:/',
];

const deviceKeywords = [
  'driver',
  'inf',
  'sys',
  'dll',
  'oem',
  'usb',
  'pci',
  'audio',
  'video',
  'network',
  'chipset',
  'storage',
  'bluetooth',
  'wifi',
  'touchpad',
  'graphics',
  'display',
  'monitor',
  'keyboard',
  'mouse',
  'printer',
  'camera',
  'sensor',
  'controller',
  'firmware',
  'bios',
  'acpi',
  'battery',
  'power',
  'input',
  'output',
  'device',
];

function isDriverFile(filename) {
  const lower = filename.toLowerCase();
  return deviceKeywords.some((k) => lower.includes(k));
}

function scan() {
  let results = [];
  for (const dir of scanPaths) {
    if (!fs.existsSync(dir)) continue;
    let files = [];
    try {
      files = fs.readdirSync(dir);
    } catch (e) {
      continue;
    }
    for (const file of files) {
      if (isDriverFile(file)) {
        results.push(path.join(dir, file));
      }
    }
  }
  return results;
}

function printResults(results) {
  if (results.length === 0) {
    console.log('No driver/device files found.');
  } else {
    console.log('Driver/device files found:');
    results.forEach((r) => console.log(r));
  }
}

if (require.main === module) {
  const results = scan();
  printResults(results);
}
