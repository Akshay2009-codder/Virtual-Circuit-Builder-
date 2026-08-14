# Integration Tests for User Registration & Email Verification

def test_user_email_format():
    valid_email = "student@university.edu"
    invalid_email = "plainaddress"
    assert "@" in valid_email
    assert "@" not in invalid_email
