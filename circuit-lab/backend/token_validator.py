# Auth Token Expiration & Refresh Handler
import time

def is_token_expired(decoded_token):
    exp = decoded_token.get('exp', 0)
    return time.time() >= exp
