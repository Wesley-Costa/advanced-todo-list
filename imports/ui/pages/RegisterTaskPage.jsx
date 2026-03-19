import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Meteor } from "meteor/meteor";
import "../styles/styles.css";

export function RegisterTaskPage() {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setError("Informe o nome da tarefa.");
      return;
    }

    if (!taskDescription.trim()) {
      setError("Informe a descrição da tarefa.");
      return;
    }

    if (!taskDate.trim()) {
      setError("Informe a data da tarefa.");
      return;
    }

    setError("");
    setSuccess("");
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
          setError(err.reason || "Erro ao cadastrar tarefa.");
          return;
        }

        setSuccess("Tarefa cadastrada com sucesso!");
        setTaskName("");
        setTaskDescription("");
        setTaskDate("");

        setTimeout(() => {
          navigate("/");
        }, 800);
      },
    );
  };

  return (
    <Container maxWidth="sm" className="register-task-container">
      <Paper elevation={3} className="register-task-paper">
        <Typography variant="h5" className="register-task-title">
          Cadastrar Tarefa
        </Typography>

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

          {error && (
            <Alert severity="error" className="register-task-alert">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="register-task-alert">
              {success}
            </Alert>
          )}

          <Box className="register-task-actions">
            <Button variant="outlined" onClick={() => navigate("/")}>
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={loading}>
              Salvar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
