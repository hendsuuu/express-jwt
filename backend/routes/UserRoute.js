import express from "express";
import { createUser, deleteUser, getUsers, getUsersById, Login, Logout, Register, updateUser } from "../controller/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";

const router = express.Router();

router.get('/users', verifyToken ,getUsers);
router.get('/users/:id',getUsersById);
// router.post('/users',createUser);
router.patch('/users/:id',updateUser);
router.delete('/users/:id',deleteUser);


router.post('/users',Register);
router.post('/login',Login);
router.get('/token',refreshToken);
router.delete('/logout',Logout);

export default router;

