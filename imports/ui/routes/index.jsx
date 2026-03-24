import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { TasksListPage } from "../pages/tasks/TasksListPage";
import { TaskRegisterPage } from "../pages/tasks/TaskRegisterPage";
import { TaskDetailsPage } from "../pages/tasks/TaskDetailsPage";
import { ProfilePage } from "../pages/profile/ProfilePage";

export default function AppRoutes() {
  const { user, isLoading } = useTracker(() => {
    return {
      user: Meteor.user(),
      isLoading: Meteor.loggingIn(),
    };
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
        />

        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <TasksListPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tasks"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <TasksListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/register"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <TaskRegisterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task/:id/edit"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <TaskDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}