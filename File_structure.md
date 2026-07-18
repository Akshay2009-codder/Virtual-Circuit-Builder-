circuit-lab/
├── .gitignore
├── README.md
│
├── backend/                              (Flask)
│   ├── app.py                            # app factory, registers all blueprints
│   ├── config.py                         # DB URI, JWT secret, CORS origins
│   ├── requirements.txt
│   ├── models.py                         # User, Project (+ run tracking), ProjectCollaborator
│   ├── component_model.py                # Component (parts catalog) model
│   ├── seed.py                           # seeds 31 parts on first boot
│   ├── auth.py                           # /api/auth/register, /login, /me
│   ├── components.py                     # /api/components (catalog, read-only)
│   ├── projects.py                       # CRUD + collaborator invite/remove
│   └── simulate.py                       # /api/projects/<id>/simulate (Run circuit + suggestions)
│
└── frontend/                             (React + Vite)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    │
    └── src/
        ├── main.jsx, App.jsx, index.css
        │
        ├── api/
        │   └── client.js
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── constants/
        │   └── categoryColors.js
        │
        ├── utils/
        │   └── timeAgo.js                # relative time formatting ("2h ago")
        │
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── AppShell.jsx              # nav: Dashboard/Components/Builder/Tutorials
        │   ├── AuthLayout.jsx
        │   ├── CircuitBackground.jsx
        │   ├── CustomCursor.jsx
        │   ├── PageTransition.jsx
        │   ├── FormField.jsx
        │   ├── PowerButton.jsx
        │   ├── PartIcon.jsx
        │   ├── NewCircuitModal.jsx       # name+description on new circuit
        │   ├── ShareModal.jsx            # invite teammates by email
        │   │
        │   ├── 3d/                       (catalog page's 3D viewer)
        │   │   ├── PartModels.jsx        # 21 model builders → 31 parts (LED lights, switch flips)
        │   │   └── PartViewer.jsx
        │   │
        │   ├── builder/                  (legacy - unused, harmless to delete)
        │   │   ├── PartNode.jsx
        │   │   └── ComponentPalette.jsx  # ← still used, drag palette sidebar
        │   │
        │   └── builder3d/                (the 3D circuit board itself)
        │       ├── raycast.js
        │       ├── Wire3D.jsx
        │       ├── PlacedPart3D.jsx      # lights up LEDs, toggleable switches, +/- polarity
        │       └── Scene3D.jsx           # workbench, lighting, camera
        │
        └── pages/
            ├── Login.jsx, Register.jsx
            ├── Dashboard.jsx             # real stats, status badges, activity feed
            ├── Components.jsx            # product-page style catalog
            ├── Builder.jsx               # 3D board, Save/Run/Share
            └── Tutorials.jsx             # 8 accordion lessons