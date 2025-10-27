const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { createTask, statusChange, updateTask, deleteTask, getParticulerTask, getUserById } = require("../controller/taskController");


const router = express.Router();

router.post("/createTask", authMiddleware, createTask);
router.put("/status/:id", authMiddleware, statusChange);
router.put("/updateTask/:id", authMiddleware, updateTask);
// router.get(
//   "/getTaskForSeparateUser/:id",
//   authMiddleware,
//   getTaskForSeparateUser
// );
router.get("/getParticulerTask/:id", authMiddleware, getParticulerTask);

router.delete("/deleteTask/:id", authMiddleware, deleteTask);
router.get("/getUserById/:id",authMiddleware,getUserById)

module.exports = router;
