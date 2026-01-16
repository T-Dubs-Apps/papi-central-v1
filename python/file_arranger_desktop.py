import os
import shutil
import tkinter as tk
from tkinter import filedialog, messagebox

# File type classification
FILE_CATEGORIES = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
    "Videos": [".mp4", ".avi", ".mov", ".mkv", ".webm"],
    "Audio": [".mp3", ".wav", ".ogg", ".flac", ".aac"],
    "Documents": [".pdf", ".doc", ".docx", ".txt", ".md", ".rtf"],
    "Archives": [".zip", ".rar", ".7z", ".tar", ".gz"],
    "Code": [".js", ".ts", ".py", ".java", ".cpp", ".c", ".cs", ".html", ".css", ".json", ".xml", ".sh", ".bat"],
}

def get_category(filename):
    ext = os.path.splitext(filename)[1].lower()
    for cat, exts in FILE_CATEGORIES.items():
        if ext in exts:
            return cat
    return "Other"

def arrange_files(src_folder):
    arranged_folder = os.path.join(os.path.dirname(src_folder), "Arranged-File-Arranger-Pro")
    os.makedirs(arranged_folder, exist_ok=True)
    for root, _, files in os.walk(src_folder):
        for file in files:
            cat = get_category(file)
            dest_dir = os.path.join(arranged_folder, cat)
            os.makedirs(dest_dir, exist_ok=True)
            src_path = os.path.join(root, file)
            dest_path = os.path.join(dest_dir, file)
            shutil.move(src_path, dest_path)
    return arranged_folder

def select_folder():
    folder = filedialog.askdirectory()
    if folder:
        try:
            result = arrange_files(folder)
            messagebox.showinfo("Success", f"Files arranged in: {result}")
        except Exception as e:
            messagebox.showerror("Error", str(e))

def main():
    root = tk.Tk()
    root.title("File Arranger Pro Desktop")
    root.geometry("400x200")
    tk.Label(root, text="Select a folder to arrange files:", font=("Arial", 12)).pack(pady=20)
    tk.Button(root, text="Select Folder", command=select_folder, font=("Arial", 12), bg="#2563eb", fg="white").pack(pady=10)
    root.mainloop()

if __name__ == "__main__":
    main()
