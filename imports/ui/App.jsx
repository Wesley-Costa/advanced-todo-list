import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ListTasksPage } from "./pages/ListTasksPage";
import { RegisterTaskPage } from "./pages/RegisterTaskPage";
import "./styles/styles.css";

export const App = () => {
  const user = useTracker(() => {
    return Meteor.user();
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/tasks" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/tasks" replace /> : <RegisterPage />}
        />
        <Route
          path="/forgot-password"
          element={
            user ? <Navigate to="/tasks" replace /> : <ForgotPasswordPage />
          }
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/tasks" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute user={user}>
              <ListTasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/register"
          element={
            <ProtectedRoute user={user}>
              <RegisterTaskPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
