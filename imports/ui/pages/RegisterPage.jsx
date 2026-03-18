import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import "../styles/auth.css";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    Meteor.call("users.register", { name, email, password }, (error) => {
      if (error) {
        alert(error.reason);
        return;
      }

      Meteor.loginWithPassword(email, password, (loginError) => {
        if (loginError) {
          alert(loginError.reason);
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
