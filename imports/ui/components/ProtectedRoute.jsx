import React from 'react';
import { Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const ProtectedRoute = ({ children }) => {
  const user = useTracker(() => Meteor.user());

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}