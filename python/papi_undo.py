import os
import shutil
import time
import threading
from datetime import datetime

BACKUP_DIR = "_papi_backup"
BACKUP_TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
BACKUP_PATH = os.path.join(BACKUP_DIR, BACKUP_TIMESTAMP)

# List of folders/files to backup (customize as needed)
TARGETS = [
    '.',  # backup everything in current directory
]

# Create backup
def create_backup():
    os.makedirs(BACKUP_PATH, exist_ok=True)
    for target in TARGETS:
        if os.path.isdir(target):
            shutil.copytree(target, os.path.join(BACKUP_PATH, target), dirs_exist_ok=True)
        elif os.path.isfile(target):
            shutil.copy2(target, BACKUP_PATH)
    print(f"Backup created at {BACKUP_PATH}")

# Restore backup
def restore_backup():
    for item in os.listdir(BACKUP_PATH):
        src = os.path.join(BACKUP_PATH, item)
        dst = os.path.join('.', item)
        if os.path.isdir(src):
            if os.path.exists(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
    print("System restored to backup state.")

# Undo timer (30 min inactivity)
class UndoTimer:
    def __init__(self, timeout=1800):
        self.timeout = timeout
        self.last_activity = time.time()
        self.timer = threading.Thread(target=self._watch)
        self.timer.daemon = True
        self.timer.start()

    def reset(self):
        self.last_activity = time.time()

    def _watch(self):
        while True:
            if time.time() - self.last_activity > self.timeout:
                print("No activity detected. Restoring backup...")
                restore_backup()
                break
            time.sleep(10)

if __name__ == "__main__":
    create_backup()
    undo = UndoTimer()
    print("Undo system active. Call undo.reset() after any user activity.")
    # Example: undo.reset() should be called after any file change or user action
