import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";

import { TasksCollection } from "../../../api/tasks/TasksCollection";
import { SideMenu } from "../../components/SideMenu";

import { Box, Button, Container, Paper, Typography, CircularProgress } from "@mui/material";

export const DashboardPage = () => {
  const navigate = useNavigate();

  const user = useTracker(() => Meteor.user());

  const { isLoading, totalTasks, inProgressTasks, completedTasks } = useTracker(() => {
    const handle = Meteor.subscribe("tasks");
    const isLoading = !handle.ready();

    const totalTasks = TasksCollection.find().count();
    const inProgressTasks = TasksCollection.find({ status: "Em Andamento" }).count();
    const completedTasks = TasksCollection.find({ status: "Concluída" }).count();

    return {
      isLoading,
      totalTasks,
      inProgressTasks,
      completedTasks,
    };
  });

  if (isLoading) {
    return (
      <>
        <SideMenu />
        <Container maxWidth="md" className="dashboard-page-container">
          <Box className="dashboard-loading-box">
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="md" className="dashboard-page-container">
        <Typography variant="h5" className="dashboard-welcome-text">
          Olá {user?.profile?.name || "usuário"}, seja bem-vindo ao seu Advanced To-do List
        </Typography>

        <Box className="dashboard-grid">
          <Paper className="dashboard-card">
            <Typography variant="body2" className="dashboard-card-label">
              Total de tarefas cadastradas
            </Typography>

            <Typography variant="h3" className="dashboard-card-value">
              {totalTasks}
            </Typography>
          </Paper>

          <Paper className="dashboard-card">
            <Typography variant="body2" className="dashboard-card-label">
              Total de tarefas em andamento
            </Typography>

            <Typography variant="h3" className="dashboard-card-value">
              {inProgressTasks}
            </Typography>
          </Paper>

          <Paper className="dashboard-card">
            <Typography variant="body2" className="dashboard-card-label">
              Total de tarefas concluídas
            </Typography>

            <Typography variant="h3" className="dashboard-card-value">
              {completedTasks}
            </Typography>
          </Paper>

          <Paper className="dashboard-card dashboard-action-card">
            <Button
              variant="text"
              className="dashboard-action-button"
              onClick={() => navigate("/tasks")}
            >
              Visualizar Tarefas
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};