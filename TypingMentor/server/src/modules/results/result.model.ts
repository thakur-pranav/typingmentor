import { Schema, model, Document, Types } from "mongoose";

export type TestMode = "timed" | "passage";

export interface ResultDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  mode: TestMode;
  duration: number;
  wpm: number;
  netWpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  createdAt: Date;
}

const resultSchema = new Schema<ResultDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mode: { type: String, enum: ["timed", "passage"], required: true },
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

export const ResultModel = model<ResultDocument>("Result", resultSchema);
