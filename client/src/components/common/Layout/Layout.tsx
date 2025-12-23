import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{ py: 3, bgcolor: "grey.50", borderTop: 1, borderColor: "divider" }}
      >
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} User Management System
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Версия 1.0.0
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
