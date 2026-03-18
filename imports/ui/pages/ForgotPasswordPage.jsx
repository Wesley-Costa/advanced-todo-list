import React, { useEffect, useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Link } from "react-router-dom";
import { Alert, Box, Button, Collapse, Paper, TextField, Typography } from "@mui/material";
import "../styles/auth.css";

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
    }, 4000);

    return () => clearTimeout(timer);
  }, [error, success]);

  const handleForgotPassword = (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    Accounts.forgotPassword({ email }, (err) => {
      setLoading(false);

      if (err) {
        console.error("Erro forgotPassword:", err);
        setError(err.reason || "Erro ao enviar email de recuperação.");
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
          <Alert severity="error" className="auth-alert">
            {error}
          </Alert>
        </Collapse>

        <Collapse in={!!success}>
          <Alert severity="success" className="auth-alert">
            {success}
          </Alert>
        </Collapse>

        <Box
          component="form"
          onSubmit={handleForgotPassword}
          className="auth-form"
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
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
}