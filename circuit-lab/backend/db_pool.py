# Database Connection Pool Management Helper
import sqlite3

def get_db_connection(db_path='circuitlab.db'):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
