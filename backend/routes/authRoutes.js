const express = require("express");
const {
  register,
  login,
  logout,
  getParticularDepartmentUserCount,
  getUsersByRole,
  getTasksByUserId,
  forgotPassword,
  updateProfile,
  getAllUser,
  deleteUser,
} = require("../Controller/auth");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/forgotPassword",forgotPassword);
router.post("/logout", authMiddleware, logout);
router.get(
  "/getParticularDepartmentUserCount",
  authMiddleware,
  getParticularDepartmentUserCount
);
router.get("/getUsersByRole/:department", authMiddleware, getUsersByRole);
router.get("/getTasksByUserId/:userId", authMiddleware, getTasksByUserId);
router.post("/updateProfile",authMiddleware,updateProfile)
router.get("/getAllUser",authMiddleware,getAllUser)
router.delete("/deleteUser/:id", authMiddleware, deleteUser);

module.exports = router;
