import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "../styles/styles.css";

export const Tasks = ({ tasks }) => {
  return (
    <List className="tasks-list">
      {tasks.map((task) => (
        <ListItem key={task._id} className="task-item">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>

          <ListItemText
            primary={task.name}
            secondary={
              <Box>
                <Typography variant="body2" color="text.secondary" className="task-item-description">
                  {task.description}
                </Typography>

                <Box className="task-date-info">
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(task.date).toLocaleString("pt-BR")}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};