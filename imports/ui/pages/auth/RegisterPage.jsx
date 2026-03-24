import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography, Alert, Collapse } from "@mui/material";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!email.trim() && !password.trim() && !name.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!email.trim()) {
      setError("Por favor, insira seu email.");
      return;
    }

    if (!password.trim()) {
      setError("Por favor, insira sua senha.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    if (password.length < 6) {
      setError("Por favor, a senha deve conter no minimo 6 caracteres.");
      return;
    }

    Meteor.call("users.register", { name, email, password }, (error) => {
      if (error) {
        setError(error.reason);
        return;
      }

      Meteor.loginWithPassword(email, password, (loginError) => {
        if (loginError) {
          setError(loginError.reason);
          return;
        }

        navigate("/");
      });
    });
  };

  return (
    <Box className="auth-page">
      <Paper elevation={3} className="auth-card">
        <Typography variant="h4" className="auth-title">
          Cadastro
        </Typography>

        <Collapse in={!!error}>
          <Alert
            severity="error"
            className="auth-alert"
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleRegister} className="auth-form">
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="auth-button"
          >
            Criar conta
          </Button>

          <Button
            component={Link}
            to="/login"
            fullWidth
            className="auth-link-button"
          >
            Já tenho conta
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
