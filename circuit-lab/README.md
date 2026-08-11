# Virtual Circuit Builder — Interactive 3D Electronics Workbench & MNA Simulator

Virtual Circuit Builder is a college project and web application for designing, simulating, and sharing 3D electronic circuits right in the browser.

## Key Features

- **Interactive 3D Workbench**: Render 3D component models including ESP32 DevKit, NeoPixel RGB Ring, Arduino Uno, micro:bit, LEDs, resistors, switches, and breadboards with Three.js.
- **Custom 3D Wiring**: Draw realistic curved 3D wires with customized color insulation (VCC Red, GND Black, Data Green, Clock Amber, Serial Blue).
- **Modified Nodal Analysis (MNA) Engine**: Exact matrix solver solving node voltages, component currents, and short-circuit protection.
- **Community Sharing & Gallery**: Share circuits with interactive 3D viewports, likes, comments, and cloneable templates.
- **Microcontroller Simulation**: Live tick endpoint supporting pin outputs and real-time sensor updates.

## Tech Stack

- **Frontend**: React, Three.js (`@react-three/fiber`, `@react-three/drei`), Vite, Lucide React icons.
- **Backend**: Python, Flask, Flask-JWT-Extended, SQLAlchemy, NumPy (MNA Matrix Solver), SQLite/PostgreSQL.

## Getting Started

### 1. Backend Setup

```bash
cd circuit-lab/backend
python -m venv venv
venv\Scripts\activate        # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python seed.py
python app.py
```

Server runs on `http://127.0.0.1:5000`.

### 2. Frontend Setup

```bash
cd circuit-lab/frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`.
