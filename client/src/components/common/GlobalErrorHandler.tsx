import React, { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError } from "../../store/slices/authSlice";

const GlobalErrorHandler: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    // Даем анимации закрытия проиграть перед очисткой стейта
    setTimeout(() => {
      dispatch(clearError());
    }, 300);
  };

  if (!error) return null;

  // Безопасное приведение ошибки к строке
  const errorMessage =
    typeof error === "string"
      ? error
      : JSON.stringify(error?.message || error || "Неизвестная ошибка");

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default GlobalErrorHandler;
