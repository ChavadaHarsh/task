const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [2, "Title must be at least 2 characters"],
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createRole: {
      type: String,
      enum: ["admin", "employee"],
      default: "staff",
    },
    createDepartment: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "Web Development",
        "Android Development",
        "iOS Development",
        "Designing",
        "admin",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "declined"],
      default: "pending",
    },
    statusChangeRole: {
      type: String,
      enum: ["admin", "employee", "none"],
      default: "none",
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Task", taskSchema);
