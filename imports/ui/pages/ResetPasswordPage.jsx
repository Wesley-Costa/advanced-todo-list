import React, { useEffect, useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "../styles/styles.css";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error && !success) return;

    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [error, success]);

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (!token) {
      setError("Token de redefinição inválido ou ausente.");
      return;
    }

    if (!password.trim() && !confirmPassword.trim()) {
      setError("Por favor, preencha os campos corretamente.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);

    Accounts.resetPassword(token, password, (error) => {
      setLoading(false);

      if (error) {
        setError("Erro ao redefinir senha.");
        return;
      }

      setSuccess("Senha redefinida com sucesso.");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    });
  };

  return (
    <Box className="auth-page">
      <Paper elevation={3} className="auth-card">
        <Typography variant="h4" className="auth-title">
          Redefinir senha
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

        <Collapse in={!!success}>
          <Alert
            severity="success"
            className="auth-alert"
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        </Collapse>

        <Box
          component="form"
          onSubmit={handleResetPassword}
          className="auth-form"
        >
          <TextField
            label="Nova senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />

          <TextField
            label="Confirmar senha"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </Button>

          <Button
            component={Link}
            to="/login"
            fullWidth
            className="auth-link-button"
            disabled={loading}
          >
            Voltar para login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
