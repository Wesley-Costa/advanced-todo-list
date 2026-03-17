import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Collapse,
} from '@mui/material';
import '../styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError('');
    }, 6000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = (event) => {
    event.preventDefault();
    setError('');

    Meteor.loginWithPassword(email, password, (loginError) => {
      if (loginError) {
        setError('Usuário ou senha inválidos.' || loginError.reason);
        return;
      }

      navigate('/');
    });
  };

  return (
    <Box className="auth-page">
      <Paper elevation={3} className="auth-card">
        <Typography variant="h4" className="auth-title">
          Login
        </Typography>

        <Collapse in={!!error}>
          <Alert severity="error" className="auth-alert">
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
            Entrar
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
}