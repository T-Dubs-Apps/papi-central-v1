# PAPI Central Undo System

This script creates a full backup of your current workspace and monitors for 30 minutes of inactivity. If no user activity is detected, it will automatically restore all files and folders to their previous state.

## Usage
1. Run `python papi_undo.py` before making changes.
2. The script will create a backup in the `_papi_backup` folder.
3. If 30 minutes pass with no activity, the system will auto-restore.
4. To prevent auto-restore, call `undo.reset()` in your code after any user action or file change.

**Note:** You can customize the `TARGETS` list in the script to specify which files/folders to back up.

---
This is a safety net for all major changes and can be extended for GUI or integration with your O/S.
