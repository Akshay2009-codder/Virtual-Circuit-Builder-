# User Project Search Query Database Indexing Helper

def build_search_query_filter(search_term):
    if not search_term:
        return "", ()
    query_str = "WHERE title LIKE ? OR tags LIKE ?"
    params = (f"%{search_term}%", f"%{search_term}%")
    return query_str, params
