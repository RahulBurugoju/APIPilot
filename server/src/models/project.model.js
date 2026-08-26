import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    baseUrl: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    projectType: {
      type: String,
      enum: ["rest"],
      default: "rest",
    },

    settings: {
      autoSave: {
        type: Boolean,
        default: true,
      },

      defaultTimeout: {
        type: Number,
        default: 30000,
        min: 1000,
        max: 120000,
      },
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
