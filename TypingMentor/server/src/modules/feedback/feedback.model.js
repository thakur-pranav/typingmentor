import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ["suggestion", "bug", "query"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ip: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index to optimize recent cooldown queries
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ email: 1, createdAt: -1 });
feedbackSchema.index({ ip: 1, createdAt: -1 });
feedbackSchema.index({ userId: 1, createdAt: -1 });

feedbackSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
