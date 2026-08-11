# Backend REST API Specification

## Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Request Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: `{ "user": { "id": "int", "username": "string", "email": "string" }, "token": "jwt_token" }`

### `POST /api/auth/login`
Authenticates existing users.
- **Request Body**: `{ "username_or_email": "string", "password": "string" }`
- **Response**: `{ "user": { "id": "int", "username": "string" }, "token": "jwt_token" }`

## Simulation Endpoint (`/api/simulate`)

### `POST /api/simulate`
Executes MNA circuit simulation on submitted circuit topology graph.
- **Request Body**:
```json
{
  "nodes": [
    { "id": "v1", "key": "dc_power", "default_value": 5.0 },
    { "id": "r1", "key": "resistor", "default_value": 220.0 }
  ],
  "edges": [
    { "id": "e1", "sourceId": "v1", "sourceTerminal": "pos", "targetId": "r1", "targetTerminal": "pin1" }
  ]
}
```
- **Response**:
```json
{
  "status": "success",
  "poweredIds": ["v1", "r1"],
  "readings": {
    "r1": { "voltage": 5.0, "current": 0.0227 }
  }
}
```

## Community Projects (`/api/community`)

### `GET /api/community/projects`
Retrieves public project gallery list.
- **Response**: Array of published project objects with owner metadata and like counts.
