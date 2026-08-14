# Component Creation Request JSON Schema Validator

REQUIRED_FIELDS = ['name', 'category', 'pins']

def validate_component_schema(data):
    if not isinstance(data, dict):
        return False, "Payload must be a JSON object"
    for field in REQUIRED_FIELDS:
        if field not in data:
            return False, f"Missing required field: {field}"
    return True, "Valid"
