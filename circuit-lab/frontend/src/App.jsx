import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Components from "./pages/Components";
import Builder from "./pages/Builder";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/components"
          element={
            <ProtectedRoute>
              <PageTransition><Components /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <PageTransition><Builder /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder/:id"
          element={
            <ProtectedRoute>
              <PageTransition><Builder /></PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}