# Virtual Circuit Builder - REST API Specification

This document details the REST API endpoints provided by the Virtual Circuit Builder backend service.

---

## Base URL
`/api`

---

## Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "username": "circuit_lover",
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "user_id": 1
  }
  ```

### `POST /api/auth/login`
Authenticates a user and issues JWT tokens.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "<jwt-access-token>",
    "user": {
      "id": 1,
      "username": "circuit_lover",
      "email": "user@example.com"
    }
  }
  ```

---

## Circuit Projects (`/api/projects`)

### `GET /api/projects`
Retrieves all projects owned by or shared with the authenticated user.
- **Headers**: `Authorization: Bearer <access_token>`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 42,
      "title": "555 LED Flasher",
      "description": "A simple astable 555 timer flasher circuit",
      "updated_at": "2026-08-14T20:00:00Z"
    }
  ]
  ```

### `POST /api/projects`
Creates a new circuit project schematic.

---

## Simulation Engine (`/api/simulate`)

### `POST /api/simulate`
Runs DC Modified Nodal Analysis (MNA) on a JSON circuit schematic layout.
- **Request Body**:
  ```json
  {
    "nodes": [
      { "id": "v1", "category": "source", "default_value": 5.0 },
      { "id": "r1", "category": "resistor", "default_value": 220, "unit": "Ω" },
      { "id": "led1", "category": "diode", "default_value": 2.0 }
    ],
    "edges": [
      { "sourceId": "v1", "sourceTerminal": "a", "targetId": "r1", "targetTerminal": "a" },
      { "sourceId": "r1", "sourceTerminal": "b", "targetId": "led1", "targetTerminal": "a" },
      { "sourceId": "led1", "sourceTerminal": "b", "targetId": "v1", "targetTerminal": "b" }
    ]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "ok": true,
    "readings": {
      "r1": { "voltage": 3.0, "current_mA": 13.64, "power_mW": 40.92 },
      "led1": { "voltage": 2.0, "current_mA": 13.64, "power_mW": 27.28, "state": "on" }
    },
    "warnings": []
  }
  ```
