import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import {  Box, Container, Paper, Typography, CircularProgress, Fab, 
  FormControlLabel, Checkbox, TextField, Button } from "@mui/material";
import { Meteor } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import { TasksCollection } from "../../../api/tasks/TasksCollection";
import { Tasks } from "../../components/Tasks";
import { SideMenu } from "../../components/SideMenu";
import AddIcon from "@mui/icons-material/Add";

const showCompleted = new ReactiveVar(false);
const searchTask = new ReactiveVar("");
const currentPage = new ReactiveVar(1);

export const TasksListPage = () => {
  const navigate = useNavigate();

  const { tasks, isLoading, showCompletedValue, searchValue, page } = useTracker(() => {
    const showCompletedValue = showCompleted.get();
    const searchValue = searchTask.get();
    const page = currentPage.get();

    const handle = Meteor.subscribe("tasks", {
      showCompleted: showCompletedValue,
      search: searchValue,
      page: page
    });

    const isLoading = !handle.ready();
    const tasks = TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch();

    return { tasks, isLoading, showCompletedValue, searchValue, page };
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

  const handleSearchChange = (event) => {
    searchTask.set(event.target.value);
  };

  const handlePreviousPage = () => {
    currentPage.set(Math.max(1, currentPage.get() - 1));
  }

  const handleNextPage = () => {
    currentPage.set(currentPage.get() + 1);
  }

  return (
    <>
      <Container maxWidth="md" className="tasks-page-container">
        <Box className="tasks-page-header">
          <Typography variant="h4" className="tasks-page-title">
            Tarefas Cadastradas
          </Typography>
        </Box>

        <Box className="tasks-page-filters">
          <TextField
            fullWidth
            label={"🔍Pesquisar por nome da tarefa"}
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            className="task-field-search"
          />

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
              Nenhuma tarefa encontrada.
            </Typography>
          ) : (
            <Tasks
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          <Box className="pagination-controls">
            <Button
              variant="outlined"
              onClick={handlePreviousPage}
              disabled={page === 1 || isLoading}
            >
              Anterior
            </Button>

            <Typography>Página {page}</Typography>

            <Button
              variant="outlined"
              onClick={handleNextPage}
              disabled={tasks.length < 4 || isLoading}
            >
              Próxima
            </Button>
          </Box>
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