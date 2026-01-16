#!/usr/bin/env python3
"""
CORTEX DESKTOP - Automated Status Checker
Verifies everything is ready for launch

Run: python check_status.py
"""

import os
import sys
import json
from datetime import datetime

class StatusChecker:
    def __init__(self):
        self.checks = []
        self.warnings = []
        self.errors = []
        
    def check_file_exists(self, filename, description):
        """Check if required file exists"""
        exists = os.path.exists(filename)
        status = "✓" if exists else "✗"
        message = f"{status} {description}: {filename}"
        
        if exists:
            self.checks.append(message)
        else:
            self.errors.append(message)
            
        return exists
    
    def check_python_dependency(self, package_name):
        """Check if Python package is installed"""
        try:
            __import__(package_name)
            self.checks.append(f"✓ Python package installed: {package_name}")
            return True
        except ImportError:
            self.errors.append(f"✗ Python package missing: {package_name}")
            return False
    
    def check_all(self):
        """Run all checks"""
        print("=" * 60)
        print("🧠 CORTEX DESKTOP - Launch Status Check")
        print("=" * 60)
        print()
        
        # Core files check
        print("📁 Checking Core Files...")
        self.check_file_exists("The_Cortex.py", "Main AI brain")
        self.check_file_exists("cortex_server.py", "Flask server")
        self.check_file_exists("cortex-desktop-bridge.html", "Web interface")
        self.check_file_exists("requirements.txt", "Dependencies list")
        print()
        
        # Launcher files
        print("🚀 Checking Launcher Files...")
        self.check_file_exists("LAUNCH-Cortex-Desktop.html", "Quick launcher")
        self.check_file_exists("LAUNCH_CORTEX.bat", "Auto setup script")
        print()
        
        # Documentation check
        print("📚 Checking Documentation...")
        self.check_file_exists("CORTEX_DESKTOP_README.md", "Main documentation")
        self.check_file_exists("CORTEX_SETUP_GUIDE.md", "Setup guide")
        self.check_file_exists("CORTEX_LAUNCH_CHECKLIST.md", "Launch checklist")
        self.check_file_exists("CORTEX_PRODUCT_SUMMARY.md", "Product summary")
        print()
        
        # Marketing files
        print("📣 Checking Marketing Files...")
        self.check_file_exists("CORTEX_PRODUCT_CARD.html", "Store product card")
        self.check_file_exists("generate_marketing.py", "Marketing generator")
        print()
        
        # Python dependencies
        print("🐍 Checking Python Dependencies...")
        self.check_python_dependency("flask")
        self.check_python_dependency("flask_cors")
        self.check_python_dependency("requests")
        print()
        
        # PAPI Central integration
        print("🔗 Checking PAPI Central Integration...")
        self.check_file_exists("index.html", "Main PAPI app")
        self.check_file_exists("PAPI Central.htm", "Store page")
        self.check_file_exists("papi-key-loader.js", "Key management")
        print()
        
        # Configuration check
        print("⚙️ Checking Configuration...")
        if os.path.exists("cortex_memory.json"):
            self.checks.append("✓ Memory file exists (has been used)")
        else:
            self.warnings.append("⚠ Memory file not created yet (will be created on first use)")
        print()
        
        # Print results
        self.print_results()
        
    def print_results(self):
        """Print status check results"""
        print("=" * 60)
        print("📊 RESULTS")
        print("=" * 60)
        print()
        
        print(f"✅ Passed: {len(self.checks)}")
        print(f"⚠️  Warnings: {len(self.warnings)}")
        print(f"❌ Errors: {len(self.errors)}")
        print()
        
        if self.warnings:
            print("⚠️  WARNINGS:")
            for warning in self.warnings:
                print(f"  {warning}")
            print()
        
        if self.errors:
            print("❌ ERRORS:")
            for error in self.errors:
                print(f"  {error}")
            print()
            print("To fix errors:")
            print("  1. Run: pip install -r requirements.txt")
            print("  2. Ensure all files are in the correct location")
            print()
        
        # Overall status
        if self.errors:
            print("🔴 STATUS: NOT READY - Fix errors above")
            return False
        elif self.warnings:
            print("🟡 STATUS: READY WITH WARNINGS - Should work but review warnings")
            return True
        else:
            print("🟢 STATUS: FULLY READY TO LAUNCH! 🚀")
            self.print_next_steps()
            return True
    
    def print_next_steps(self):
        """Print recommended next steps"""
        print()
        print("=" * 60)
        print("🎯 NEXT STEPS")
        print("=" * 60)
        print()
        print("Quick Start (5 minutes):")
        print("  1. Double-click: LAUNCH_CORTEX.bat")
        print("  2. Choose option 3 (Server + Web)")
        print("  3. Start chatting with Cortex!")
        print()
        print("Marketing Launch (Today):")
        print("  1. Run: python generate_marketing.py")
        print("  2. Review: marketing_content.json")
        print("  3. Post to social media")
        print()
        print("Store Integration (10 minutes):")
        print("  1. Open: PAPI Central.htm")
        print("  2. Add product card from: CORTEX_PRODUCT_CARD.html")
        print("  3. Test purchase flow")
        print()
        print("Full checklist: CORTEX_LAUNCH_CHECKLIST.md")
        print()

def main():
    checker = StatusChecker()
    success = checker.check_all()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
