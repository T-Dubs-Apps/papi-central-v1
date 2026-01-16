# PAPI O/S Universal Driver File Scan Tool

This tool scans the system board and searches for driver/device files on boot or reboot. It is designed for both integration into the PAPI O/S and standalone use.

## Files
- `papi-os-driver-scan.js`: Universal module for PAPI O/S (browser/Node.js)
- `papi-os-driver-scan-standalone.js`: Standalone Node.js CLI tool

## Usage

### PAPI O/S Integration
```javascript
// In your PAPI O/S boot logic:
await DriverScan.scan();
DriverScan.printResults();
```

### Standalone (Node.js)
```bash
node papi-os-driver-scan-standalone.js
```

## Scan Logic
- Searches common Windows driver/device directories
- Matches files using device/driver keywords
- Ignores inaccessible paths
- Prints results to console

## Customization
- Edit `scanPaths` and `deviceKeywords` arrays to support other OSes or device types

## Security
- Read-only scan, does not modify system files
- No elevated privileges required
