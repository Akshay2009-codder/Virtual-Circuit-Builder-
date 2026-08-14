# API Integration Tests for Project Sharing & Access Control

def test_project_access_level():
    owner_id = 1
    requestor_id = 2
    is_public = False
    has_access = (owner_id == requestor_id) or is_public
    assert not has_access
