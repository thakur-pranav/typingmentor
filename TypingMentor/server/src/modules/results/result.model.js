import { Schema, model } from "mongoose";

const resultSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mode: { type: String, enum: ["timed", "passage", "code"], required: true },
    duration: { type: Number, required: true, min: 0 },
    wpm: { type: Number, required: true, min: 0, index: true },
    netWpm: { type: Number, required: true, min: 0 },
    accuracy: { type: Number, required: true, min: 0, max: 100 },
    totalCharacters: { type: Number, required: true, min: 0 },
    correctCharacters: { type: Number, required: true, min: 0 },
    incorrectCharacters: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Supports "history for this user, most recent first" efficiently.
resultSchema.index({ userId: 1, createdAt: -1 });

resultSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.userId = ret.userId.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ResultModel = model("Result", resultSchema);
