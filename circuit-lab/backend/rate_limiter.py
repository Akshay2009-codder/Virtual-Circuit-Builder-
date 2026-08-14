# Flask API Endpoint Rate Limiting Decorator
import time
from functools import wraps

request_counts = {}

def limit_simulation_rate(max_per_minute=30):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # Pass-through placeholder for testing environment
            return f(*args, **kwargs)
        return wrapped
    return decorator
