circuit-lab/
├── .gitignore
├── README.md
│
├── backend/                          (Flask)
│   ├── app.py                        # app factory, registers all blueprints
│   ├── config.py                     # DB URI, JWT secret, CORS origins
│   ├── requirements.txt
│   ├── models.py                     # User + Project models
│   ├── component_model.py            # Component (parts catalog) model
│   ├── seed.py                       # seeds the 6 starter parts on first boot
│   ├── auth.py                       # /api/auth/register, /login, /me
│   ├── components.py                 # /api/components (catalog, read-only)
│   ├── projects.py                   # /api/projects CRUD (save/load circuits)
│   │
│   └── simulate.py                   ⏳ Phase 4 — MNA solver, /api/simulate
│
└── frontend/                         (React + Vite)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    │
    └── src/
        ├── main.jsx                  # React entry point
        ├── App.jsx                   # routes + AnimatePresence + cursor mount
        ├── index.css                 # design tokens + cursor styles
        │
        ├── api/
        │   └── client.js             # axios instance, attaches JWT to requests
        │
        ├── context/
        │   └── AuthContext.jsx       # login/register/logout state
        │
        ├── components/
        │   ├── ProtectedRoute.jsx    # route guard
        │   ├── AppShell.jsx          # top nav (Dashboard/Components/Builder)
        │   ├── AuthLayout.jsx        # shared Login/Register page frame
        │   ├── CircuitBackground.jsx # animated PCB trace ambient background
        │   ├── CustomCursor.jsx      # probe-tip cursor (teal → copper on hover)
        │   ├── PageTransition.jsx    # fade/slide wrapper for route changes
        │   ├── FormField.jsx         # styled input
        │   ├── PowerButton.jsx       # submit button w/ continuity-tester LED
        │   │
        │   ├── 3d/
        │   │   ├── PartModels.jsx    # Three.js primitive models per part
        │   │   └── PartViewer.jsx    # Canvas + lighting + orbit controls
        │   │
        │   └── builder/
        │       ├── PartNode.jsx          # a placed component on the canvas
        │       ├── ComponentPalette.jsx  # draggable parts list (right panel)
        │       └── HealthPanel.jsx       ⏳ Phase 4 — sim results / readings
        │
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx         # lists saved circuits, "+ New circuit"
            ├── Components.jsx        # 3D catalog page
            └── Builder.jsx           # drag/drop canvas, save/load circuits