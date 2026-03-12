import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import { useSearchParams } from "react-router-dom";
import type { SortOrder } from "../../shared/api/productsApi";
import { useGetProductsQuery } from "../../shared/api/productsApi";
import { AddProductModal } from "./AddProductModal";
import { toast } from "react-toastify";

type SortField = "price" | "rating" | undefined;

const DEFAULT_LIMIT = 20;

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") ?? "";
  const initialSortBy =
    (searchParams.get("sortBy") as SortField | null) ?? undefined;
  const initialOrder = (searchParams.get("order") as SortOrder | null) ?? "asc";

  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<SortField>(initialSortBy);
  const [order, setOrder] = useState<SortOrder>(initialOrder);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Debounce search value
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  // Sync sort and search state to URL
  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      nextParams.set("search", debouncedSearch);
    } else {
      nextParams.delete("search");
    }

    if (sortBy) {
      nextParams.set("sortBy", sortBy);
      nextParams.set("order", order);
    } else {
      nextParams.delete("sortBy");
      nextParams.delete("order");
    }

    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch, sortBy, order, searchParams, setSearchParams]);

  const queryParams = useMemo(
    () => ({
      limit: DEFAULT_LIMIT,
      search: debouncedSearch || undefined,
      sortBy,
      order,
    }),
    [debouncedSearch, order, sortBy],
  );

  const { data, isFetching, error } = useGetProductsQuery(queryParams);

  useEffect(() => {
    if (error) {
      const message =
        "error" in error && typeof error.error === "string"
          ? error.error
          : "Не удалось загрузить товары. Попробуйте ещё раз.";

      toast.error(message);
    }
  }, [error]);

  const handleSort = (field: SortField): void => {
    if (!field) return;

    if (sortBy === field) {
      setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <Box sx={{ pt: 4, pb: 4 }}>
      {isFetching && <LinearProgress sx={{ mb: 2 }} />}
      <Paper
        sx={{
          mb: 3,
          px: 3,
          py: 2.5,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Товары
          </Typography>

          <TextField
            placeholder="Найти"
            variant="outlined"
            fullWidth
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Box
          sx={{
            px: 3,
            pt: 2.5,
            pb: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Все позиции
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setIsAddModalOpen(true)}
            sx={{ borderRadius: 999, px: 3 }}
          >
            Добавить
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox color="primary" />
              </TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>Вендор</TableCell>
              <TableCell>Артикул</TableCell>
              <TableCell sortDirection={sortBy === "rating" ? order : false}>
                <TableSortLabel
                  active={sortBy === "rating"}
                  direction={sortBy === "rating" ? order : "asc"}
                  onClick={() => handleSort("rating")}
                >
                  Оценка
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortBy === "price" ? order : false}>
                <TableSortLabel
                  active={sortBy === "price"}
                  direction={sortBy === "price" ? order : "asc"}
                  onClick={() => handleSort("price")}
                >
                  Цена, ₽
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.products.map((product) => {
              const imageSrc = product.images[0] ?? product.thumbnail;

              return (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Checkbox color="primary" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={imageSrc}
                        alt={product.title}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 0.25 }}
                        >
                          {product.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {product.category}
                        </Typography>
                      </Box>
                    </Box>
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
                        color:
                          product.rating < 3
                            ? theme.palette.error.main
                            : "inherit",
                      })}
                    >
                      {product.rating.toFixed(1)}/5
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {product.price.toLocaleString("ru-RU", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
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
  );
};
