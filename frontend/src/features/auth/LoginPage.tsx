import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../shared/api/authApi";
import iconSrc from "../../assets/login-icon.svg";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const usernameValue = watch("username");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = await login({
        username: values.username,
        password: values.password,
      }).unwrap();

      const tokenKey = "token";

      window.localStorage.removeItem(tokenKey);
      window.sessionStorage.removeItem(tokenKey);

      const storage: Storage = values.rememberMe
        ? window.localStorage
        : window.sessionStorage;

      storage.setItem(tokenKey, response.token);

      toast.success("Вы успешно вошли в систему");
      navigate("/products", { replace: true });
    } catch {
      // error handled via mutation error state
    }
  };

  const apiErrorMessage =
    (error &&
      "data" in error &&
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data &&
      typeof (error.data as { message?: string }).message === "string" &&
      (error.data as { message?: string }).message) ||
    "Не удалось выполнить вход. Попробуйте ещё раз.";

  useEffect(() => {
    if (error) {
      toast.error(apiErrorMessage);
    }
  }, [apiErrorMessage, error]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          borderRadius: 5,
          bgcolor: "#F5F5F7",
        }}
      >
        <Box
          component="img"
          src={iconSrc}
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            mx: "auto",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Добро пожаловать!
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary", mb: 4 }}
        >
          Пожалуйста, авторизируйтесь
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block", mb: 0.5, color: "text.secondary" }}
              >
                Логин
              </Typography>
              <TextField
                fullWidth
                autoComplete="username"
                placeholder="test"
                {...register("username", {
                  required: "Имя пользователя обязательно",
                })}
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: usernameValue ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => setValue("username", "")}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block", mb: 0.5, color: "text.secondary" }}
              >
                Пароль
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password", {
                  required: "Пароль обязателен",
                  minLength: {
                    value: 4,
                    message: "Пароль должен содержать минимум 4 символа",
                  },
                })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <FormControlLabel
              control={<Checkbox {...register("rememberMe")} color="primary" />}
              label="Запомнить данные"
              sx={{ ml: 0, color: "text.secondary" }}
            />

            {error && <Alert severity="error">{apiErrorMessage}</Alert>}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.2, borderRadius: 999 }}
            >
              {isLoading ? "Входим..." : "Войти"}
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mt: 1,
              }}
            >
              <Divider sx={{ flex: 1 }} />
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                или
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Нет аккаунта?{" "}
              <Link href="#" underline="hover">
                Создать
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
