const bcrypt = require("bcryptjs");
const User = require("../models/user");
const registerValidation = require("../validation/userValidation");
const UserLoginValidation = require("../validation/userLoginValidation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "harshchavada";
const Task = require("../models/task");
const updateProfileValidation = require("../validation/updateProfileValidation");

exports.register = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });

    const { fname, lname, email, password, role, state, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
      role: role || "staff",
      state: state || "offline",
      department: department || "Finance",
    });

    await user.save();

    const { password: _, ...userData } = user.toObject();
    res
      .status(201)
      .json({ message: "User registered successfully", user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = UserLoginValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    user.state = "online";
    user.lastActive = new Date();
    await user.save();

    setTimeout(async () => {
      const u = await User.findById(user._id);
      if (u) {
        u.state = "offline";
        await u.save();
      }
    }, 60 * 60 * 1000);

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and new password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      return res.status(400).json({ message: "Please use a new password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        state: "offline",
        lastActive: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User logged out successfully",
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        state: user.state,
        lastActive: user.lastActive,
      },
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getParticularDepartmentUserCount = async (req, res) => {
  try {
    const allDepartments = [
      "Web Development",
      "Android Development",
      "iOS Development",
      "Designing",
    ];

    // 1️⃣ Aggregate users with task counts
    const counts = await User.aggregate([
      {
        $match: {
          department: { $in: allDepartments },
          role: { $ne: "admin" }, // exclude admin
        },
      },
      {
        $lookup: {
          from: "tasks", // tasks collection
          localField: "_id", // user _id
          foreignField: "userId", // tasks.userId
          as: "tasks",
        },
      },
      {
        $project: {
          department: 1,
          taskCount: { $size: "$tasks" },
          completedCount: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.status", "completed"] },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$department",
          totalUsers: { $sum: 1 },
          totalTasks: { $sum: "$taskCount" },
          totalCompleted: { $sum: "$completedCount" },
        },
      },
    ]);

    // 2️⃣ Map aggregation result to allDepartments
    const countMap = {};
    counts.forEach((c) => {
      const percent =
        c.totalTasks === 0
          ? 0
          : Math.round((c.totalCompleted / c.totalTasks) * 100);
      countMap[c._id] = {
        totalUsers: c.totalUsers,
        totalTasks: c.totalTasks,
        totalCompleted: c.totalCompleted,
        completedPercent: percent,
      };
    });

    const result = allDepartments.map((dept) => ({
      departmentName: dept,
      totalUsers: countMap[dept]?.totalUsers || 0,
      totalTasks: countMap[dept]?.totalTasks || 0,
      totalCompleted: countMap[dept]?.totalCompleted || 0,
      completedPercent: countMap[dept]?.completedPercent || 0,
    }));

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching department task counts:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { department } = req.params;

    if (!department) {
      return res
        .status(400)
        .json({ success: false, message: "Department is required" });
    }

    const users = await User.find({
      department,
      role: { $ne: "admin" },
    });

    const usersWithTaskStats = await Promise.all(
      users.map(async (user) => {
        // Total tasks
        const tasks = await Task.find({ userId: user._id });

        // Completed tasks
        const completedTasks = await Task.countDocuments({
          userId: user._id,
          status: "completed",
        });
        const totalTasks = tasks.length;
        // Completion percentage
        const completionPercentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        return {
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
      })
    );

    return res.status(200).json({ success: true, data: usersWithTaskStats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getTasksByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const tasks = await Task.find({ userId });
    return res.status(200).json({ success: true, tasks: tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const data = req.body;

    const { error } = updateProfileValidation.validate(data, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    if (!data.id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const existingUser = await User.findById(data.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    existingUser.fname = data.fname ?? existingUser.fname;
    existingUser.lname = data.lname ?? existingUser.lname;
    existingUser.email = data.email ?? existingUser.email;
    existingUser.department = data.department ?? existingUser.department;

    const updatedUser = await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};


exports.getAllUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can view all users.",
      });
    }

const users = await User.find({ role: { $ne: "admin" } }).select("-password");
 
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can delete users.",
      });
    }

    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user.",
    });
  }
};

