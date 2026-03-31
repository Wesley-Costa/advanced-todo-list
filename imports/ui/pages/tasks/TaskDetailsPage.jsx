import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import { TasksCollection } from "../../../api/tasks/TasksCollection";
import { SideMenu } from "../../components/SideMenu";

import { Box, Button, Container, Stack, Paper, TextField, Typography, CircularProgress, Alert, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, Checkbox } from "@mui/material";


export const TaskDetailsPage = () => {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user());
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const [redirecting, setRedirecting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");

  const { task, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe("tasks", { _id: id });
    const isLoading = !handle.ready();

    const task = TasksCollection.findOne({ _id: id });

    return { task, isLoading };
  }, [id]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    date: "",
    userName: "",
    isPersonal: false,
  });

  useEffect(() => {
    if (redirecting) {
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    }
  }, [redirecting, navigate]);

  const formatDateToInput = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || "",
        description: task.description || "",
        status: task.status || "Cadastrada",
        date: task.date ? formatDateToInput(task.date) : "",
        userName: task.userName || "",
        isPersonal: task.isPersonal || false,
      });
    }
  }, [task]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenDialog = (action) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogAction("");
  };

  const handleSaveEdit = async () => {
    try {
      setFeedback({ type: "", message: "" });

      await Meteor.callAsync("tasks.update", {
        _id: id,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        date: formData.date,
        userName: formData.userName,
        isPersonal: formData.isPersonal,
      });

      setIsEditing(false);
      setFeedback({
        type: "success",
        message: "Tarefa atualizada com sucesso! Redirecionando...",
      });
      setRedirecting(true);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.reason || "Erro ao atualizar tarefa.",
      });
    }
  };

  const handleCancelEdit = () => {
    if (task) {
      setFormData({
        name: task.name || "",
        description: task.description || "",
        status: task.status || "Cadastrada",
        date: task.date ? formatDateToInput(task.date) : "",
        userName: task.userName || "",
        isPersonal: task.isPersonal || false,
      });
    }

    setIsEditing(false);
    setFeedback({
      type: "warning",
      message: "Edição cancelada. Redirecionando...",
    });
    setRedirecting(true);
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      setFeedback({ type: "", message: "" });

      Meteor.call("tasks.updateStatus", {
        _id: id,
        status: newStatus,
      });

      setFeedback({
        type: "success",
        message: `Status alterado para "${newStatus}" com sucesso.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.reason || "Erro ao alterar status.",
      });
    }
  };

  const handleConfirmAction = async () => {
    handleCloseDialog();

    if (dialogAction === "save") {
      await handleSaveEdit();
    }

    if (dialogAction === "cancel") {
      handleCancelEdit();
    }
  };

  const getDialogTitle = () => {
    if (dialogAction === "save") return "Confirmar salvamento";
    if (dialogAction === "cancel") return "Confirmar cancelamento";
    return "Confirmar ação";
  };

  const getDialogMessage = () => {
    if (dialogAction === "save") {
      return "Deseja salvar as alterações realizadas nesta tarefa?";
    }

    if (dialogAction === "cancel") {
      return "Deseja cancelar a edição? As alterações não salvas serão perdidas.";
    }

    return "Deseja continuar?";
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" className="task-details-container">
        <Box className="task-details-loading-box">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="md" className="task-details-container">
        <Paper className="task-details-paper">
          <Typography variant="h6" className="task-details-not-found">
            Tarefa não encontrada.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const currentStatus = task.status;

  return (
    <>
      <Container maxWidth="md" className="task-details-container">
        <Paper className="task-details-paper">
          <Typography variant="h4" className="task-details-title">
            {isEditing ? "Editar Tarefa" : "Visualizar Tarefa"}
          </Typography>

          {user?._id === task.userId && (
            <Box className="task-details-actions-top">
              {!isEditing ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    setFeedback({ type: "", message: "" });
                    setIsEditing(true);
                  }}
                  disabled={redirecting}
                >
                  Editar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(false)}
                  disabled={redirecting}
                >
                  Visualizar
                </Button>
              )}
            </Box>
          )}

          {feedback.message && (
            <Box className="task-details-alert-wrapper">
              <Alert severity={feedback.type} sx={{ mb: 2 }}>
                {feedback.message}
              </Alert>
            </Box>
          )}

          {!isEditing && user?._id === task.userId && (
            <Box className="task-details-status-actions">
              <Typography variant="h6">
                Alterar Situação da Tarefa
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleChangeStatus("Em Andamento")}
                  disabled={currentStatus !== "Cadastrada"}
                >
                  Iniciar
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleChangeStatus("Concluída")}
                  disabled={currentStatus !== "Em Andamento"}
                >
                  Concluir
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleChangeStatus("Cadastrada")}
                  disabled={currentStatus === "Cadastrada"}
                >
                  Voltar para Cadastrada
                </Button>
              </Stack>
            </Box>
          )}

          <Box className="task-details-form">
            <TextField
              label="Criador"
              value={formData.userName}
              disabled
              className="task-details-field"
            />

            <TextField
              label="Nome"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!isEditing || redirecting}
              className="task-details-field"
            />

            <TextField
              label="Descrição"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={!isEditing || redirecting}
              multiline
              rows={3}
              className="task-details-field"
            />

            <TextField
              label="Situação"
              value={formData.status}
              disabled
              className="task-details-field"
            />

            <TextField
              label="Data"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              disabled={!isEditing || redirecting}
              InputLabelProps={{ shrink: true }}
              className="task-details-field"
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPersonal}
                onChange={(e) => handleChange("isPersonal", e.target.checked)}
                disabled={!isEditing || redirecting}
              />
            }
            label="Tarefa pessoal"
          />

          <Box className="task-details-actions-bottom">
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleOpenDialog("save")}
                  disabled={redirecting}
                >
                  Salvar
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleOpenDialog("cancel")}
                  disabled={redirecting}
                >
                  Cancelar
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/tasks")}
                  disabled={redirecting}
                >
                  Voltar
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={() => navigate("/tasks")}
                disabled={redirecting}
              >
                Voltar
              </Button>
            )}
          </Box>

          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogContent>
              <DialogContentText>{getDialogMessage()}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Não</Button>
              <Button
                onClick={handleConfirmAction}
                variant="contained"
                autoFocus
              >
                Sim
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </>
  );
}
