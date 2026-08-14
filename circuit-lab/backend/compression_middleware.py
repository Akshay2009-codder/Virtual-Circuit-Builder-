# Gzip Payload Compression Middleware for Circuit Data Exports
import gzip

def compress_payload(json_bytes):
    return gzip.compress(json_bytes)
