import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import {  Box, Container, Paper, Typography, CircularProgress, Fab, FormControlLabel, Checkbox } from "@mui/material";
import { Meteor } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import { TasksCollection } from "../../../api/tasks/TasksCollection";
import { Tasks } from "../../components/Tasks";
import { SideMenu } from "../../components/SideMenu";
import AddIcon from "@mui/icons-material/Add";

const showCompleted = new ReactiveVar(false);

export const TasksListPage = () => {
  const navigate = useNavigate();

  const { tasks, isLoading, showCompletedValue } = useTracker(() => {
    const showCompletedValue = showCompleted.get();

    const handle = Meteor.subscribe("tasks", { showCompleted: showCompletedValue });
    const isLoading = !handle.ready();

    const tasks = TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch();

    return { tasks, isLoading, showCompletedValue };
  });

  const handleDeleteTask = ({ _id }) => {
    Meteor.callAsync("tasks.delete", { _id });
  };

  const handleEditTask = ({ _id }) => {
    navigate(`/task/${_id}/edit`);
  };

  const handleToggleShowCompleted = (event) => {
    showCompleted.set(event.target.checked);
  };

  return (
    <>
      <SideMenu />
      <Container maxWidth="md" className="tasks-page-container">
        <Box className="tasks-page-header">
          <Typography variant="h4" className="tasks-page-title">
            Tarefas Cadastradas
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={showCompletedValue}
                onChange={handleToggleShowCompleted}
              />
            }
            label="Exibir tarefas concluídas"
          />
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
            <Tasks
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
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
    </>
  );
};