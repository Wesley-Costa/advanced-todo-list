import React, { useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Menu, MenuItem, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../styles/styles.css";

export const Tasks = ({ tasks, onEditTask, onDeleteTask }) => {
  const [anchorEl, setAchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const user = useTracker(() => Meteor.user())

  const handleMenuOpen = (e, task) => {
    setAchorEl(e.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAchorEl(null);
    setSelectedTask(null);
  };

  const handleEditTask = () => {
    if (selectedTask && onEditTask) {
      onEditTask(selectedTask);
    }
    handleMenuClose();
  };

  const handleDeleteTask = () => {
    if (selectedTask && onDeleteTask) {
      onDeleteTask(selectedTask);
    }
    handleMenuClose();
  };

  const handleOpenDialog = (action) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogAction("");
  };

  const handleConfirmAction = async () => {
    handleCloseDialog();

    if (dialogAction === "delete") {
      handleDeleteTask();
    }
  };

  const getDialogTitle = () => {
    if (dialogAction === "delete") return "Confirmar exclusão";
    return "Confirmar ação";
  };

  const getDialogMessage = () => {
    if (dialogAction === "delete") {
      return "Deseja deletar a tarefa?";
    }

    return "Deseja continuar?";
  };

  return (
    <>
      <List className="tasks-list">
        {tasks.map((task) => (
          <ListItem key={task._id} className="task-item">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>

            <ListItemText
              primary={
                <Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    className="task-item-title"
                  >
                    {new Date(task.date).toLocaleString("pt-BR")} - {task.name}
                  </Typography>
                </Box>
              }
              secondary={
                <Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    className="task-item-username"
                  >
                    {task.userName}
                  </Typography>
                </Box>
              }
            />
            <IconButton onClick={(e) => handleMenuOpen(e, task)}>
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditTask}>
          { user?._id === selectedTask?.userId ? "Editar" : "Visualizar"}
        </MenuItem>
        
        <MenuItem onClick={() => handleOpenDialog("delete")}  disabled={user?._id !== selectedTask?.userId}>Excluir</MenuItem>
      
      </Menu>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          <DialogContentText>{getDialogMessage()}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Não</Button>
          <Button onClick={handleConfirmAction} variant="contained" autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
