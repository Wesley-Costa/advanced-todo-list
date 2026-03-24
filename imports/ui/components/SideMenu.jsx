import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import {  Drawer, Toolbar, Divider, List, ListItemButton, ListItemIcon, ListItemText, IconButton,
  Avatar, Typography, Box, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

export function SideMenu() {
  const [expanded, setExpanded] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useTracker(() => Meteor.user());

  const handleToggleMenu = () => {
    setExpanded((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    Meteor.logout(() => {
      navigate("/");
    });
  };

  return (
    <Drawer
      variant="permanent"
      className={`side-menu-drawer ${expanded ? "expanded" : "collapsed"}`}
      classes={{
        paper: `side-menu-paper ${expanded ? "expanded" : "collapsed"}`,
      }}
    >
      <Toolbar className="side-menu-header">
        <IconButton onClick={handleToggleMenu} className="side-menu-toggle">
          <MenuIcon />
        </IconButton>

        {expanded && (
          <Typography variant="h6" className="side-menu-title">
            Menu
          </Typography>
        )}
      </Toolbar>

      <Divider />

      <Box className="side-menu-user-section">
        <Avatar className="side-menu-avatar">
          {(user?.profile?.name || "U")[0].toUpperCase()}
        </Avatar>

        {expanded && (
          <Box className="side-menu-user-info">
            <Typography variant="body1" className="side-menu-user-name">
              {user?.profile?.name || "Sem nome"}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Box>
        <List className="side-menu-list">
          <Tooltip title={!expanded ? "Tarefas" : ""} placement="right">
            <ListItemButton
              selected={location.pathname === "/tasks"}
              onClick={() => handleNavigate("/tasks")}
              className="side-menu-item"
            >
              <ListItemIcon className="side-menu-icon">
                <AssignmentIcon />
              </ListItemIcon>

              {expanded && <ListItemText primary="Tarefas" />}
            </ListItemButton>
          </Tooltip>

          <Tooltip title={!expanded ? "Perfil" : ""} placement="right">
            <ListItemButton
              selected={location.pathname === "/profile"}
              onClick={() => handleNavigate("/profile")}
              className="side-menu-item"
            >
              <ListItemIcon className="side-menu-icon">
                <AccountCircleIcon />
              </ListItemIcon>

              {expanded && <ListItemText primary="Perfil" />}
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>

      <Box className="side-menu-footer">
        <Divider />

        <Tooltip title={!expanded ? "Logout" : ""} placement="right">
          <ListItemButton
            onClick={handleLogout}
            className="side-menu-item logout-item"
          >
            <ListItemIcon className="side-menu-icon logout-icon">
              <LogoutIcon />
            </ListItemIcon>

            {expanded && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
