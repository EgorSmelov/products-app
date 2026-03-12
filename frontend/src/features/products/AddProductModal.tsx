import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../app/store'
import type { GetProductsParams, Product } from '../../shared/api/productsApi'
import { productsApi } from '../../shared/api/productsApi'
import { toast } from 'react-toastify'

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  queryParams: GetProductsParams
}

interface AddProductFormValues {
  title: string
  price: number
  brand: string
  sku: string
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  queryParams,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues>({
    defaultValues: {
      title: '',
      price: 0,
      brand: '',
      sku: '',
    },
  })

  const handleClose = (): void => {
    if (isSubmitting) return
    onClose()
  }

  const onSubmit = async (values: AddProductFormValues): Promise<void> => {
    const now = Date.now()

    const newProduct: Product = {
      id: now,
      title: values.title,
      description: '',
      price: Number(values.price),
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      brand: values.brand,
      category: '',
      sku: values.sku,
      thumbnail: '',
      images: [],
    }

    dispatch(
      productsApi.util.updateQueryData('getProducts', queryParams, (draft) => {
        draft.products.unshift(newProduct)
        draft.total += 1
      }),
    )

    toast.success('Товар успешно добавлен')
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить товар</DialogTitle>
      <DialogContent>
        <form id="add-product-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Название"
              fullWidth
              {...register('title', { required: 'Название обязательно' })}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
            <TextField
              label="Цена"
              type="number"
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              {...register('price', {
                required: 'Цена обязательна',
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || 'Цена должна быть положительным числом',
              })}
              error={Boolean(errors.price)}
              helperText={errors.price?.message}
            />
            <TextField
              label="Вендор (brand)"
              fullWidth
              {...register('brand')}
            />
            <TextField
              label="Артикул (sku)"
              fullWidth
              {...register('sku')}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button
          type="submit"
          form="add-product-form"
          variant="contained"
          disabled={isSubmitting}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

