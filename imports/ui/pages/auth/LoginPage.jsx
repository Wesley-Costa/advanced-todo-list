import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Paper, TextField, Typography, Collapse } from '@mui/material';

export const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 6000);

    return () => clearTimeout(timer);
  }, [error]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() && !password.trim()) {
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

    setLoading(true);

    Meteor.loginWithPassword({ email }, password, (error) => {
      setLoading(false);

      if (error) {
        setError("Usuário ou senha inválidos.");
        return;
      }

      navigate("/")
    });
  };

  return (
    <Box className="auth-page">
      <Paper elevation={3} className="auth-card">
        <Typography variant="h4" className="auth-title">
          Login
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

        <Box component="form" onSubmit={handleLogin} className="auth-form">
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <Button
            component={Link}
            to="/register"
            fullWidth
            className="auth-link-button"
          >
            Cadastrar
          </Button>

          <Button
            component={Link}
            to="/forgot-password"
            fullWidth
            className="auth-link-button"
          >
            Esqueci minha senha
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};