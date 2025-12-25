import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Service API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
      },
      users: {
        getAll: "GET /api/users",
        getById: "GET /api/users/:id",
        update: "PUT /api/users/:id",
        block: "PATCH /api/users/:id/block",
        changePassword: "PATCH /api/users/:id/password",
        delete: "DELETE /api/users/:id",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
