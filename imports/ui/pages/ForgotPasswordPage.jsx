import React, { useEffect, useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Link } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography, Collapse } from "@mui/material";
import "../styles/styles.css";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error && !success) return;
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 6000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim()) {
      setError("Por favor, insira seu email.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    Accounts.forgotPassword({ email }, (error) => {
      setLoading(false);
      if (error) {
        setError(
          "Erro ao enviar email de recuperação. Possível e-mail não cadastrado!",
        );
        return;
      }
      setSuccess("Email de recuperação enviado com sucesso.");
      setEmail("");
    });
  };

  return (
    <Box className="auth-page">
      <Paper elevation={3} className="auth-card">
        <Typography variant="h4" className="auth-title">
          Recuperar senha
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

        {success && (
          <Alert
            severity="success"
            className="auth-alert"
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleForgotPassword}
          className="auth-form"
        >
          <TextField
            label="Email"
            type="text" // ← mudado de "email" para "text"
            fullWidth
            margin="normal"
            value={email}
            disabled={loading}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
              if (success) setSuccess("");
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar email"}
          </Button>
          <Button
            component={Link}
            to="/login"
            fullWidth
            className="auth-link-button"
          >
            Voltar para login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
