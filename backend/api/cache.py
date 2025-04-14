import time

"""

Placeholder for cache implementation in future imporvements

""" 
cache_store = {}
CACHE_TTL = 60  # seconds

def get_cached_response(key):
    entry = cache_store.get(key)
    if entry:
        data, expires_at = entry
        if time.time() < expires_at:
            return data
        del cache_store[key]
    return None

def set_cached_response(key, data):
    cache_store[key] = (data, time.time() + CACHE_TTL)