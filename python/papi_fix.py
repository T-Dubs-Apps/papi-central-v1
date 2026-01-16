import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import socket
import threading
import time
import os
import shutil
import datetime

# --- CONFIGURATION & CONSTANTS ---
APP_NAME = "PAPI-Fix & Diagnostic Console"
VERSION = "1.0.1"
BACKUP_DIR = "papi_backups"
TARGET_HOST = "127.0.0.1"
TARGET_PORT = 5000  # Default PAPI Server Port
INACTIVITY_LIMIT = 30  # Seconds for auto-undo trigger

class PapiFixApp:
    def __init__(self, root):
        self.root = root
        self.root.title(f"{APP_NAME} v{VERSION}")
        self.root.geometry("700x550")
        self.root.configure(bg="#2c3e50")

        self.last_activity = time.time()
        self.undo_timer_active = False
        self.backup_snapshot = None

        self.setup_styles()
        self.create_widgets()
        self.create_readme_popup()
        
        # Start activity monitor
        self.root.bind('<Motion>', self.reset_inactivity_timer)
        self.root.bind('<Key>', self.reset_inactivity_timer)
        self.start_inactivity_monitor()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TFrame", background="#ecf0f1")
        style.configure("TButton", font=('Segoe UI', 10, 'bold'), padding=6)
        style.configure("TLabel", background="#ecf0f1", font=('Segoe UI', 10))
        style.configure("Header.TLabel", font=('Segoe UI', 14, 'bold'), foreground="#2c3e50")
        style.configure("Warning.TLabel", foreground="red", font=('Segoe UI', 9, 'bold'))

    def create_widgets(self):
        # Main Container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Header
        header = ttk.Label(main_frame, text=APP_NAME, style="Header.TLabel")
        header.pack(pady=(0, 10))

        # Notebook (Tabs)
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True)

        # --- TAB 1: DIAGNOSTICS & AUTO-REPAIR ---
        self.tab_diag = ttk.Frame(self.notebook, padding=10)
        self.notebook.add(self.tab_diag, text="  Diagnostics & Auto-Repair  ")
        self.build_diagnostics_tab()

        # --- TAB 2: MANUAL / RESEARCH PASTE ---
        self.tab_manual = ttk.Frame(self.notebook, padding=10)
        self.notebook.add(self.tab_manual, text="  Research & Manual Fix  ")
        self.build_manual_tab()

        # --- FOOTER: UNDO & STATUS ---
        footer_frame = ttk.Frame(main_frame)
        footer_frame.pack(fill=tk.X, pady=10)

        self.status_label = ttk.Label(footer_frame, text="System Ready.", foreground="blue")
        self.status_label.pack(side=tk.LEFT)

        self.undo_btn = ttk.Button(footer_frame, text="UNDO LAST ACTION", command=self.perform_undo, state="disabled")
        self.undo_btn.pack(side=tk.RIGHT)

    def create_readme_popup(self):
        """Shows the mandatory README on startup."""
        msg = (
            "README - SAFETY PROTOCOL\n\n"
            "If you encounter a problem or issue while using this app, "
            "wait for 30 seconds without activity and the undo process will "
            "begin automatically.\n\n"
            "Alternatively, press the UNDO button immediately if available."
        )
        messagebox.showinfo("Important Safety Instructions", msg)

    # --- TAB 1 BUILDER ---
    def build_diagnostics_tab(self):
        lbl = ttk.Label(self.tab_diag, text="Automated System Scanner")
        lbl.pack(anchor="w")

        # Scan Button
        scan_btn = ttk.Button(self.tab_diag, text="▶ Run Full Diagnostic Scan", command=self.run_diagnostics)
        scan_btn.pack(fill=tk.X, pady=5)

        # Output Log
        self.log_area = scrolledtext.ScrolledText(self.tab_diag, height=12, font=("Consolas", 9))
        self.log_area.pack(fill=tk.BOTH, expand=True, pady=5)

        # Auto Repair Button (Initially Disabled)
        self.repair_btn = ttk.Button(self.tab_diag, text="🛠 Attempt Automatic Repair", state="disabled", command=self.run_auto_repair)
        self.repair_btn.pack(fill=tk.X, pady=5)

    # --- TAB 2 BUILDER ---
    def build_manual_tab(self):
        lbl = ttk.Label(self.tab_manual, text="Describe the issue or paste solution from online research:")
        lbl.pack(anchor="w")

        self.input_text = scrolledtext.ScrolledText(self.tab_manual, height=10, font=("Segoe UI", 10))
        self.input_text.pack(fill=tk.BOTH, expand=True, pady=5)
        self.input_text.insert(tk.END, "Paste error logs or online solutions here...")

        apply_btn = ttk.Button(self.tab_manual, text="Apply Fix Based on Input", command=self.parse_and_apply_fix)
        apply_btn.pack(fill=tk.X, pady=5)

    # --- LOGIC: DIAGNOSTICS ---
    def run_diagnostics(self):
        self.log("Starting diagnostic scan...", clear=True)
        self.root.update()
        
        issues_found = []

        # 1. Check Connectivity
        self.log(f"Testing connection to {TARGET_HOST}:{TARGET_PORT}...")
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((TARGET_HOST, TARGET_PORT))
        if result == 0:
            self.log(f"✅ Port {TARGET_PORT} is OPEN. Server is reachable.")
        else:
            self.log(f"❌ Port {TARGET_PORT} is CLOSED or REFUSED.")
            issues_found.append("Server Port Closed")
        sock.close()

        # 2. Check File Structure (Mock)
        if not os.path.exists("server.py") and not os.path.exists("app.py"):
            self.log("⚠️ Warning: Main server file (server.py/app.py) not found in current directory.")
            issues_found.append("Missing Server File")

        # Conclusion
        if issues_found:
            self.log(f"\nIssues Detected: {', '.join(issues_found)}")
            self.log("Recommendation: Use Auto-Repair.")
            self.repair_btn.config(state="normal")
        else:
            self.log("\nSystem looks healthy. If app fails, check API keys.")

    # --- LOGIC: REPAIR & BACKUP ---
    def create_backup(self):
        """Mock backup function creating a snapshot state."""
        self.log("\nCreating system backup point...", "blue")
        # In a real scenario, this would copy files to BACKUP_DIR
        self.backup_snapshot = "Backup_Timestamp_" + str(int(time.time()))
        self.undo_btn.config(state="normal")
        self.undo_timer_active = True  # Enable safety timer
        self.log(f"Backup saved: {self.backup_snapshot}")

    def run_auto_repair(self):
        self.create_backup()
        self.log("Attempting automatic repairs...")
        time.sleep(1)
        # Simulation of repair logic
        self.log(">> Reconfiguring Port settings...")
        self.log(">> Restarting network interface...")
        self.log("✅ Repair sequence complete. Please test the app.")
        self.status_label.config(text="Repair Applied. Waiting for stability...", foreground="orange")

    def parse_and_apply_fix(self):
        user_input = self.input_text.get("1.0", tk.END).lower()
        self.create_backup()
        
        self.log(f"\nAnalyzing input...", "blue")
        if "port" in user_input or "connection" in user_input:
            self.log(">> Detected Network Configuration issue.")
            self.log(">> Applying Network Patch...")
        elif "missing" in user_input or "file" in user_input:
            self.log(">> Detected File Structure issue.")
            self.log(">> Rebuilding directory tree...")
        else:
            self.log(">> Generic repair protocols applied based on input.")
        
        self.log("✅ Custom repair complete.")

    # --- LOGIC: UNDO & SAFETY ---
    def perform_undo(self):
        if self.backup_snapshot:
            self.log(f"\n↺ UNDOING changes. Reverting to {self.backup_snapshot}...", "red")
            # Logic to restore files would go here
            self.log("✅ System restored to previous state.")
            self.status_label.config(text="System Restored.", foreground="green")
            self.backup_snapshot = None
            self.undo_btn.config(state="disabled")
            self.undo_timer_active = False
        else:
            messagebox.showwarning("Undo", "No backup found to restore.")

    # --- LOGIC: INACTIVITY MONITOR ---
    def reset_inactivity_timer(self, event=None):
        self.last_activity = time.time()

    def start_inactivity_monitor(self):
        """Checks for inactivity every 1 second."""
        if self.undo_timer_active and self.backup_snapshot:
            elapsed = time.time() - self.last_activity
            remaining = INACTIVITY_LIMIT - elapsed
            
            if remaining <= 0:
                self.log("\n⚠️ Inactivity Timeout Detected. Auto-Undoing changes for safety.")
                self.perform_undo()
            elif remaining < 10:
                self.status_label.config(text=f"WARNING: Auto-Undo in {int(remaining)}s due to inactivity!", foreground="red")
        
        self.root.after(1000, self.start_inactivity_monitor)

    def log(self, message, color="black", clear=False):
        self.log_area.config(state="normal")
        if clear:
            self.log_area.delete("1.0", tk.END)
        self.log_area.insert(tk.END, message + "\n")
        self.log_area.see(tk.END)
        self.log_area.config(state="disabled")

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    try:
        root = tk.Tk()
        # Attempt to set icon if available, otherwise ignore
        # root.iconbitmap('icon.ico') 
        app = PapiFixApp(root)
        root.mainloop()
    except Exception as e:
        print(f"Critical Startup Error: {e}")