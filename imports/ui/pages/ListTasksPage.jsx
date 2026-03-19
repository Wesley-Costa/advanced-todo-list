import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Typography, CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../../api/TasksCollection";
import { Tasks } from "../components/Tasks";
import "../styles/styles.css";

export function ListTasksPage() {
  const navigate = useNavigate();

  const { tasks, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe("tasks");
    const isLoading = !handle.ready();

    const tasks = TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch();

    return { tasks, isLoading };
  });

  return (
    <Container maxWidth="md" className="tasks-page-container">
      <Box className="tasks-page-header">
        <Typography variant="h4" className="tasks-page-title">
          Tarefas Cadastradas
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={() => Meteor.logout()}
        >
          Logout
        </Button>
      </Box>

      <Paper className="tasks-page-paper">
        {isLoading ? (
          <Box className="tasks-loading-box">
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Typography className="tasks-empty-text">
            Nenhuma tarefa cadastrada.
          </Typography>
        ) : (
          <Tasks tasks={tasks} />
        )}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate("/tasks/register")}
        className="add-task-fab"
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}
