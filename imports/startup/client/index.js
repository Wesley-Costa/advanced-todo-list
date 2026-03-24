import React from "react";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { App } from "../../ui/App";

import "../../ui/styles/globals.css";
import "../../ui/styles/auth.css";
import "../../ui/styles/tasks.css";
import "../../ui/styles/components.css";
import "../../ui/styles/profile.css";

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container);
  root.render(<App />);
});