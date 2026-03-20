import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Paper, TextField, Typography, Dialog, 
  DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Meteor } from "meteor/meteor";
import "../styles/styles.css";

export function TaskRegisterPage() {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");

  const handleOpenDialog = (action) => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogAction("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOpenDialog("save");
  };

  const confirmSubmit = () => {
    if (!taskName.trim()) {
      setFeedback({
        type: "error",
        message: "Informe o nome da tarefa.",
      });
      return;
    }

    if (!taskDescription.trim()) {
      setFeedback({
        type: "error",
        message: "Informe a descrição da tarefa.",
      });
      return;
    }

    if (!taskDate.trim()) {
      setFeedback({
        type: "error",
        message: "Informe a data da tarefa.",
      });
      return;
    }

    setFeedback({ type: "", message: "" });
    setLoading(true);

    Meteor.call(
      "tasks.insert",
      {
        taskName,
        taskDescription,
        taskDate,
      },
      (err) => {
        setLoading(false);

        if (err) {
          setFeedback({
            type: "error",
            message: err.reason || "Erro ao cadastrar tarefa.",
          });
          return;
        }

        setFeedback({
          type: "success",
          message: "Tarefa cadastrada com sucesso. Redirecionando...",
        });

        setTaskName("");
        setTaskDescription("");
        setTaskDate("");

        setTimeout(() => {
          navigate("/tasks");
        }, 1000);
      },
    );
  };

  const handleCancel = () => {
    setFeedback({
      type: "warning",
      message: "Cadastro cancelado.",
    });

    setTimeout(() => {
      navigate("/tasks");
    }, 1000);
  };

  const handleConfirmAction = () => {
    handleCloseDialog();

    if (dialogAction === "save") {
      confirmSubmit();
    }

    if (dialogAction === "cancel") {
      handleCancel();
    }
  };

  const getDialogTitle = () => {
    if (dialogAction === "save") return "Confirmar cadastro";
    if (dialogAction === "cancel") return "Confirmar cancelamento";
    return "Confirmar ação";
  };

  const getDialogMessage = () => {
    if (dialogAction === "save") {
      return "Deseja confirmar o cadastro desta tarefa?";
    }

    if (dialogAction === "cancel") {
      return "Deseja cancelar o cadastro? Os dados preenchidos serão perdidos.";
    }

    return "Deseja continuar?";
  };

  return (
    <Container maxWidth="sm" className="register-task-container">
      <Paper elevation={3} className="register-task-paper">
        <Typography variant="h5" className="register-task-title">
          Cadastrar Tarefa
        </Typography>

        {feedback.message && (
          <Box className="register-task-alert-wrapper">
            <Alert severity={feedback.type} className="register-task-alert">
              {feedback.message}
            </Alert>
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="register-task-form"
        >
          <TextField
            fullWidth
            label="Nome"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Descrição"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Data e hora"
            type="datetime-local"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box className="register-task-actions">
            <Button
              variant="outlined"
              onClick={() => handleOpenDialog("cancel")}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={loading}>
              Salvar
            </Button>
          </Box>
        </Box>

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
      </Paper>
    </Container>
  );
}
