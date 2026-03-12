import React, { useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLoginMutation } from '../../shared/api/authApi'

interface LoginFormValues {
  username: string
  password: string
  rememberMe: boolean
}

export const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: 'emilys',
      password: 'emilyspass',
      rememberMe: false,
    },
  })

  const navigate = useNavigate()
  const [login, { isLoading, error }] = useLoginMutation()

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = await login({
        username: values.username,
        password: values.password,
      }).unwrap()

      const storage: Storage = values.rememberMe
        ? window.localStorage
        : window.sessionStorage

      storage.setItem('token', response.token)

      toast.success('Вы успешно вошли в систему')
      navigate('/products', { replace: true })
    } catch {
      // error handled via mutation error state
    }
  }

  const apiErrorMessage =
    (error &&
      'data' in error &&
      typeof error.data === 'object' &&
      error.data !== null &&
      'message' in error.data &&
      typeof (error.data as { message?: string }).message === 'string' &&
      (error.data as { message?: string }).message) ||
    'Не удалось выполнить вход. Попробуйте ещё раз.'

  useEffect(() => {
    if (error) {
      toast.error(apiErrorMessage)
    }
  }, [apiErrorMessage, error])

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" component="h2" mb={3}>
        Вход в аккаунт
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Имя пользователя"
            fullWidth
            autoComplete="username"
            {...register('username', {
              required: 'Имя пользователя обязательно',
            })}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            autoComplete="current-password"
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 4,
                message: 'Пароль должен содержать минимум 4 символа',
              },
            })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <FormControlLabel
            control={<Checkbox {...register('rememberMe')} color="primary" />}
            label="Запомнить меня"
          />
          {error && <Alert severity="error">{apiErrorMessage}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Входим...' : 'Войти'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

