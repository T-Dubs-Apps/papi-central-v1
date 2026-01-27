"""
activation_client.py

Reusable helper to validate activation tokens against PAPI Central.

Usage:
  from activation_client import require_activation

  @app.route('/chat', methods=['POST'])
  @require_activation()
  def chat():
      # request is validated, implement endpoint
      ...

The decorator checks the `X-Activation-Token` header or `activation_token`
field in JSON body and calls the central `/check-token` endpoint.
If invalid, it returns a 401 JSON response.
"""

import os
import functools
import requests
from flask import request, jsonify

CENTRAL_URL = os.environ.get('PAPI_CENTRAL_URL', 'http://localhost:3000')


def check_token_with_central(token: str) -> dict:
    """Call central server /check-token. Returns dict on success or raises."""
    if not token:
        return {'valid': False, 'error': 'no-token'}
    try:
        resp = requests.post(
            f"{CENTRAL_URL.rstrip('/')}/check-token",
            json={'token': token},
            timeout=5,
        )
    except Exception as e:
        return {'valid': False, 'error': 'network', 'detail': str(e)}

    if resp.status_code != 200:
        try:
            return {'valid': False, 'error': 'server', 'detail': resp.text}
        except Exception:
            return {'valid': False, 'error': 'server', 'detail': 'non-200'}

    try:
        data = resp.json()
    except Exception:
        return {'valid': False, 'error': 'invalid-json', 'detail': resp.text}

    # Accept multiple possible response shapes from central server
    if data.get('valid') is True or data.get('ok') is True or 'payload' in data:
        return {'valid': True, 'data': data}
    return {'valid': False, 'error': 'invalid-token', 'data': data}


def require_activation(header_names=('X-Activation-Token',), body_key='activation_token'):
    """Flask decorator to require activation token.

    Checks headers listed in `header_names` then JSON body key `body_key`.
    On failure returns 401 JSON; on success attaches `g.activation_payload`.
    """

    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            # Look in headers
            token = None
            for h in header_names:
                token = request.headers.get(h)
                if token:
                    break

            # If no header token, check JSON body
            if not token:
                try:
                    j = request.get_json(silent=True) or {}
                except Exception:
                    j = {}
                token = j.get(body_key)

            result = check_token_with_central(token)
            if not result.get('valid'):
                return jsonify({'success': False, 'error': 'activation_required', 'detail': result}), 401

            # Optionally expose payload to handlers
            try:
                from flask import g
                g.activation_payload = result.get('data')
            except Exception:
                pass

            return fn(*args, **kwargs)

        return wrapper

    return decorator


if __name__ == '__main__':
    print('activation_client helper module')
    print('CENTRAL_URL=', CENTRAL_URL)
