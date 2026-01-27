Automation & Integration
=========================

This folder contains automation helpers to keep backends and clients integrated with PAPI Central.

Files:
- `task_runner.py` — orchestrates injectors, syntax checks and mobile pub-get.
- `apply_activation_to_backends.py` — conservative injector (already present).
- `force_apply_activation.py` — force applicator for specific targets (already present).
- `activation_client.py` — runtime helper used by injected hooks.
- `admin_activate.py` — helper to call `/admin/activate` using local secret.

Quick run locally:

```powershell
python "papi-central/task_runner.py"
```

CI:
- A GitHub Actions workflow `.github/workflows/auto_integration.yml` runs the injector and checks on push/PR to `main`.

Notes & safety:
- Injector scripts create `.bak` backups before modifying files. Review backups before committing.
- Ensure you store `REPO_API_KEY` securely; do not commit secrets.
