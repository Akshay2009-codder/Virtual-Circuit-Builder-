# Contributing to Virtual Circuit Builder

Thank you for contributing to Virtual Circuit Builder! Below are guidelines and instructions for setting up your development environment and submitting contributions.

## Environment Setup

### Frontend (React + Three.js + Vite)
```bash
cd circuit-lab/frontend
npm install
npm run dev
```

### Backend (Python + Flask + SQLite)
```bash
cd circuit-lab/backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python seed.py
python app.py
```

## Pull Request Guidelines

1. **Commit Messages**: Follow standard conventional commits format (e.g. `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `test: ...`).
2. **Coding Standards**: Ensure JavaScript uses ES6+ idioms and Python follows PEP8 styling.
3. **Tests**: Add unit tests for new frontend utilities under `src/utils/__tests__` and backend routes under `backend/tests`.
