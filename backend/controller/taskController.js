// controller/taskController.js
const Task = require("../models/task.js");
const User = require("../models/user.js");

const {
  taskValidationSchema,
  taskStatusChangeValidationSchema,
} = require("../validation/taskValidation.js");

exports.createTask = async (req, res) => {
  try {
    const { error } = taskValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const newTaskData = {
      title: req.body.title,

      userId: req.body.userId,
      createRole: req.body.createRole,
      createDepartment: req.body.createDepartment,
      status: req.body.status || "pending",
      statusChangeRole: req.body.statusChangeRole || "none",
      adminId: req.body.adminId || null,
    };

    const task = await Task.create(newTaskData);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.statusChange = async (req, res) => {
  try {
    const { error, value } = taskStatusChangeValidationSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }
    const id = req.params.id ?? null;
    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    const task = await Task.findByIdAndUpdate(
      id,
      {
        status: req.body.status,
        statusChangeRole: req.body.statusChangeRole,
        adminId: req.body.adminId || null,
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { error, value } = taskValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.getTaskForSeparateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

//     if (!tasks || tasks.length === 0) {
//       return res.status(404).json({ message: "No tasks found for this user" });
//     }

//     res.status(200).json({
//       message: "Tasks fetched successfully",
//       tasks,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getParticulerTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // ✅ Fetch the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ Fetch tasks assigned to this user
    const tasks = await Task.find({ userId: id });

    // ✅ Calculate task statistics
    const completedTasks = await Task.countDocuments({
      userId: id,
      status: "completed",
    });

    const totalTasks = tasks.length;
    const completionPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // ✅ Combine user details with stats
    const userWithTaskStats = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
      state: user.state,
      department: user.department,
      tasks,
      completedTasks,
      totalTasks,
      completionPercentage: completionPercentage.toFixed(2),
    };

    return res.status(200).json({
      success: true,
      data: userWithTaskStats,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
