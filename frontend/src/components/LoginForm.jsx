import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import apiClient from "../apiClient";
import ApiRoutes from "../urls.js";
import {isTokenValid} from "../utils.js";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("access_token");
  const isAuthenticated = token && isTokenValid(token);

  const handleLogin = async () => {
    try {
      const response = await apiClient.post(ApiRoutes.AUTH.LOGIN, {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      window.location.reload();
    } catch {
      alert("Ошибка авторизации");
    }
  };

  if (isAuthenticated) return null;

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 300 }}>
        <Typography variant="h6" gutterBottom>
          Вход
        </Typography>
        <TextField
          fullWidth
          label="Имя пользователя"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Пароль"
          type="password"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={!username.trim() || !password.trim()}
        >
          Войти
        </Button>
      </Paper>
    </Box>
  );
}
