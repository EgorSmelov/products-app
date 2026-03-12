import React, { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Button,
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import type { SortOrder } from '../../shared/api/productsApi'
import { useGetProductsQuery } from '../../shared/api/productsApi'
import { AddProductModal } from './AddProductModal'
import { toast } from 'react-toastify'

type SortField = 'price' | 'rating' | undefined

const DEFAULT_LIMIT = 20

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialSearch = searchParams.get('search') ?? ''
  const initialSortBy = (searchParams.get('sortBy') as SortField | null) ?? undefined
  const initialOrder = (searchParams.get('order') as SortOrder | null) ?? 'asc'

  const [searchInput, setSearchInput] = useState<string>(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch)
  const [sortBy, setSortBy] = useState<SortField>(initialSortBy)
  const [order, setOrder] = useState<SortOrder>(initialOrder)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)

  // Debounce search value
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchInput])

  // Sync sort and search state to URL
  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams)

    if (debouncedSearch) {
      nextParams.set('search', debouncedSearch)
    } else {
      nextParams.delete('search')
    }

    if (sortBy) {
      nextParams.set('sortBy', sortBy)
      nextParams.set('order', order)
    } else {
      nextParams.delete('sortBy')
      nextParams.delete('order')
    }

    setSearchParams(nextParams, { replace: true })
  }, [debouncedSearch, sortBy, order, searchParams, setSearchParams])

  const queryParams = useMemo(
    () => ({
      limit: DEFAULT_LIMIT,
      search: debouncedSearch || undefined,
      sortBy,
      order,
    }),
    [debouncedSearch, order, sortBy],
  )

  const { data, isFetching, error } = useGetProductsQuery(queryParams)

  useEffect(() => {
    if (error) {
      const message =
        'error' in error && typeof error.error === 'string'
          ? error.error
          : 'Не удалось загрузить товары. Попробуйте ещё раз.'

      toast.error(message)
    }
  }, [error])

  const handleSort = (field: SortField): void => {
    if (!field) return

    if (sortBy === field) {
      setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setOrder('asc')
    }
  }

  return (
    <Box>
      {isFetching && <LinearProgress sx={{ mb: 2 }} />}

      <Box mb={2} display="flex" gap={2}>
        <Box flex={1}>
          <TextField
            label="Поиск по названию"
            variant="outlined"
            fullWidth
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          Добавить товар
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Изображение</TableCell>
              <TableCell>Название</TableCell>
              <TableCell sortDirection={sortBy === 'price' ? order : false}>
                <TableSortLabel
                  active={sortBy === 'price'}
                  direction={sortBy === 'price' ? order : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  Цена
                </TableSortLabel>
              </TableCell>
              <TableCell>Вендор</TableCell>
              <TableCell>Артикул</TableCell>
              <TableCell sortDirection={sortBy === 'rating' ? order : false}>
                <TableSortLabel
                  active={sortBy === 'rating'}
                  direction={sortBy === 'rating' ? order : 'asc'}
                  onClick={() => handleSort('rating')}
                >
                  Рейтинг
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.products.map((product) => {
              const imageSrc = product.images[0] ?? product.thumbnail

              return (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={imageSrc}
                      alt={product.title}
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.price}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.brand}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{product.sku}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={(theme) => ({
                        color: product.rating < 3 ? theme.palette.error.main : 'inherit',
                      })}
                    >
                      {product.rating}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        queryParams={queryParams}
      />
    </Box>
  )
}

