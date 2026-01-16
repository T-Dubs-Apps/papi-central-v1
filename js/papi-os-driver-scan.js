// PAPI O/S Universal Driver File Scan Tool
// Scans system board and searches for driver/device files on boot/reboot
// Standalone and embeddable for PAPI O/S

(function (global) {
  const DriverScan = {
    results: [],
    scanPaths: [
      'C:/Windows/System32/DriverStore/FileRepository',
      'C:/Windows/System32/drivers',
      'C:/Drivers',
      'C:/Program Files',
      'C:/Program Files (x86)',
      'C:/',
    ],
    deviceKeywords: [
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
    ],
    scan: async function () {
      this.results = [];
      for (const path of this.scanPaths) {
        try {
          const files = await this.listFiles(path);
          for (const file of files) {
            if (this.isDriverFile(file)) {
              this.results.push({ path, file });
            }
          }
        } catch (e) {
          // Ignore inaccessible paths
        }
      }
      return this.results;
    },
    listFiles: async function (dir) {
      // Node.js version: use fs
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir);
      }
      // Browser: not supported
      return [];
    },
    isDriverFile: function (filename) {
      const lower = filename.toLowerCase();
      return this.deviceKeywords.some((k) => lower.includes(k));
    },
    printResults: function () {
      if (this.results.length === 0) {
        console.log('No driver/device files found.');
      } else {
        console.log('Driver/device files found:');
        this.results.forEach((r) => {
          console.log(r.path + '/' + r.file);
        });
      }
    },
  };
  // Standalone execution
  if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
      await DriverScan.scan();
      DriverScan.printResults();
    })();
  }
  // Export for PAPI O/S
  global.DriverScan = DriverScan;
})(typeof window !== 'undefined' ? window : global);
