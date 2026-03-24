import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { SideMenu } from "../../components/SideMenu";
import {  Alert, Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";

export const ProfilePage = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    birthDate: "",
    gender: "",
    company: "",
    photo: "",
  });

  const [savedForm, setSavedForm] = useState({
    name: "",
    email: "",
    birthDate: "",
    gender: "",
    company: "",
    photo: "",
  });

  const genderLabels = {
    masculino: "Masculino",
    feminino: "Feminino",
    outro: "Outro",
    "prefiro-nao-informar": "Prefiro não informar",
  };

  const { user, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe("users.me");

    return {
      user: Meteor.user(),
      isLoading: !handle.ready(),
    };
  });

  useEffect(() => {
    if (!user) return;

    const populated = {
      name: user?.profile?.name || "",
      email: user?.emails?.[0]?.address || "",
      birthDate: user?.profile?.birthDate || "",
      gender: user?.profile?.gender || "",
      company: user?.profile?.company || "",
      photo: user?.profile?.photo || "",
    };

    setForm(populated);
    setSavedForm(populated);
  }, [user?._id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        photo: reader.result || "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    setError("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setForm(savedForm);
    setError("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setError("");
    setConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSave = () => {
    setLoadingSave(true);
    setConfirmOpen(false);
    setError("");
    setSuccessMessage("");

    Meteor.call("users.updateProfile", form, (err) => {
      setLoadingSave(false);

      if (err) {
        setError(err.reason || "Erro ao salvar perfil.");
        return;
      }

      setSavedForm(form);
      setIsEditing(false);
      setSuccessMessage("Perfil atualizado com sucesso.");
    });
  };

  if (isLoading) {
    return (
      <>
        <SideMenu />
        <Container maxWidth="md" className="profile-page-container">
          <Box className="profile-loading-box">
            <Typography>Carregando perfil...</Typography>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <SideMenu />

      <Container maxWidth="sm" className="profile-page-container">
        <Paper className="profile-page-paper">
          <Typography variant="h4" className="profile-page-title">
            {isEditing ? "Editar Perfil" : "Perfil"}
          </Typography>

          {!isEditing && successMessage && (
            <Box className="profile-alert-wrapper">
              <Alert severity="success" onClose={() => setSuccessMessage("")}>
                {successMessage}
              </Alert>
            </Box>
          )}

          <Stack className="profile-avatar-section">
            <Avatar
              src={form.photo || ""}
              alt={form.name || "Usuário"}
              className="profile-avatar"
            >
              {!form.photo && (form.name || "U")[0].toUpperCase()}
            </Avatar>

            {isEditing && (
              <Button
                variant="outlined"
                component="label"
                size="small"
                className="profile-photo-button"
              >
                Escolher foto
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </Button>
            )}
          </Stack>

          {isEditing ? (
            <Stack spacing={2} className="profile-form">
              <TextField
                label="Nome"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Data de nascimento"
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />

              <TextField
                select
                label="Sexo"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="">Selecione</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="feminino">Feminino</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
                <MenuItem value="prefiro-nao-informar">
                  Prefiro não informar
                </MenuItem>
              </TextField>

              <TextField
                label="Empresa que trabalha"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                fullWidth
                required
              />
            </Stack>
          ) : (
            <Box className="profile-details">
              <Box className="profile-field">
                <Typography variant="caption" color="text.secondary">
                  Nome
                </Typography>
                <Typography variant="body1">{form.name || "—"}</Typography>
              </Box>

              <Box className="profile-field">
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{form.email || "—"}</Typography>
              </Box>

              <Box className="profile-field">
                <Typography variant="caption" color="text.secondary">
                  Data de nascimento
                </Typography>
                <Typography variant="body1">
                  {form.birthDate || "—"}
                </Typography>
              </Box>

              <Box className="profile-field">
                <Typography variant="caption" color="text.secondary">
                  Sexo
                </Typography>
                <Typography variant="body1">
                  {genderLabels[form.gender] || "—"}
                </Typography>
              </Box>

              <Box className="profile-field">
                <Typography variant="caption" color="text.secondary">
                  Empresa
                </Typography>
                <Typography variant="body1">{form.company || "—"}</Typography>
              </Box>
            </Box>
          )}

          {error && (
            <Box className="profile-alert-wrapper">
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            </Box>
          )}

          <Box className="profile-form-actions">
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancelEdit}
                  disabled={loadingSave}
                >
                  Cancelar
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSaveClick}
                  disabled={loadingSave}
                >
                  {loadingSave ? "Salvando..." : "Salvar"}
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleEditClick}>
                Editar
              </Button>
            )}
          </Box>

          <Dialog open={confirmOpen} onClose={handleCancelConfirm}>
            <DialogTitle>Confirmar alterações</DialogTitle>

            <DialogContent>
              <DialogContentText>
                Deseja salvar as alterações feitas no perfil?
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCancelConfirm}>Não</Button>
              <Button onClick={handleConfirmSave} variant="contained" autoFocus>
                Sim
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </>
  );
};