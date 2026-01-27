#!/usr/bin/env python3
"""
task_runner.py

Orchestrates automated integrations, repairs and patches across the repo.

Features:
- Runs the activation injector(s) and force applicator
- Performs lightweight Python syntax checks on modified files
- Attempts to run `flutter pub get` in mobile apps if Flutter is installed
- Writes a run log to `papi-central/automation.log`

This script is safe/optimistic: it creates backups (the injector scripts already do),
and will skip steps that are not available on the host.
"""

import subprocess
import sys
import os
from pathlib import Path
import datetime

ROOT = Path(__file__).resolve().parents[1]
CENTRAL = ROOT / 'papi-central'
LOGFILE = CENTRAL / 'automation.log'


def log(msg):
    ts = datetime.datetime.utcnow().isoformat() + 'Z'
    line = f'[{ts}] {msg}'
    print(line)
    with open(LOGFILE, 'a', encoding='utf-8') as f:
        f.write(line + '\n')


def run(cmd, cwd=None, check=False):
    try:
        log(f'RUN: {cmd} (cwd={cwd})')
        res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        log(f'OUT: {res.stdout.strip()}')
        if res.stderr.strip():
            log(f'ERR: {res.stderr.strip()}')
        if check and res.returncode != 0:
            raise subprocess.CalledProcessError(res.returncode, cmd)
        return res.returncode, res.stdout, res.stderr
    except Exception as e:
        log(f'EXCEPTION running {cmd}: {e}')
        return 1, '', str(e)


def run_injectors():
    scripts = [
        CENTRAL / 'apply_activation_to_backends.py',
        CENTRAL / 'force_apply_activation.py'
    ]
    for s in scripts:
        if s.exists():
            run(f'python "{s}"', cwd=ROOT)
        else:
            log(f'Script not found: {s}')


def python_syntax_check():
    py_files = list((ROOT / 'apps').rglob('*.py'))
    log(f'Checking syntax for {len(py_files)} Python files')
    for p in py_files:
        run(f'python -m py_compile "{p}"')


def flutter_get():
    mobi = ROOT / 'apps' / 'PAPI_Mobile'
    if not mobi.exists():
        log('Mobile app folder not present; skipping flutter pub get')
        return
    # Check flutter is available
    code, out, err = run('flutter --version')
    if code != 0:
        log('Flutter not available on PATH; skipping flutter pub get')
        return
    # run pub get
    run('flutter pub get', cwd=str(mobi))


def main():
    log('=== Automation run started ===')
    run_injectors()
    python_syntax_check()
    flutter_get()
    log('=== Automation run completed ===')


if __name__ == '__main__':
    main()
