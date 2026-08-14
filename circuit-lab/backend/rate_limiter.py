import time
from collections import defaultdict
from functools import wraps
from flask import request, jsonify

class TokenBucketRateLimiter:
    """
    In-memory Token Bucket rate limiter for Flask routes.
    """
    def __init__(self, requests_per_minute=60):
        self.rate = requests_per_minute / 60.0  # tokens per second
        self.capacity = requests_per_minute
        self.tokens = defaultdict(lambda: self.capacity)
        self.last_update = defaultdict(time.time)

    def is_allowed(self, key):
        now = time.time()
        elapsed = now - self.last_update[key]
        self.last_update[key] = now

        # Add tokens accumulated since last call
        self.tokens[key] = min(self.capacity, self.tokens[key] + elapsed * self.rate)

        if self.tokens[key] >= 1.0:
            self.tokens[key] -= 1.0
            return True
        return False


limiter_instance = TokenBucketRateLimiter(requests_per_minute=120)


def rate_limit(requests_per_minute=60):
    """
    Decorator for Flask view functions to enforce IP-based rate limits.
    """
    limiter = TokenBucketRateLimiter(requests_per_minute=requests_per_minute)

    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip_address = request.remote_addr or "127.0.0.1"
            if not limiter.is_allowed(ip_address):
                return jsonify({
                    "error": "Too Many Requests",
                    "message": f"Rate limit exceeded. Maximum {requests_per_minute} requests per minute."
                }), 429
            return f(*args, **kwargs)
        return wrapped
    return decorator
