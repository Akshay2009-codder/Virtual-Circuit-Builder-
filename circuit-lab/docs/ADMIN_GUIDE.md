# CircuitLab Admin & Governance Guide

This document outlines the architecture, security model, and feature set of the CircuitLab Admin Panel.

## 1. Authentication & Security
- **SuperAdmin Identity**: Dedicated root account `Akshay_07`.
- **Separate JWT Route**: Dedicated `/api/admin/login` ensuring standard credentials cannot bypass root privileges without `is_admin=True`.
- **Guard Layer**: Frontend `AdminRoute` protecting `/admin/*` routes, redirecting unauthenticated requests.
- **Backend Enforcer**: `admin_required` decorator enforcing role checks on all database operations.

## 2. Administration Modules
- **Dashboard**: Real-time KPI telemetry, 7-day user/project delta, and recent creation feeds.
- **User Management**: User search, role delegation, account suspension, password resets, and cascaded account deletion.
- **Project Governance**: 3D read-only inspection, gallery publishing/unpublishing, and schematic deletion.
- **Hardware Catalog (CRUD)**: Dynamic part definition (keys, units, ratings, pin layouts) feeding the builder `ComponentPalette` live without deployments.
- **Moderation Queue**: Community flagged circuit investigation, reporter notes review, and instant resolution actions.
- **System Settings**: Global feature toggles (gallery submissions, registrations, maintenance mode) and root password changes.
