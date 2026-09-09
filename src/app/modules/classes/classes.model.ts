import { Schema, model } from "mongoose";
import { IClass } from "./classes.interface";

const classSchema = new Schema<IClass>(
  {
    title: { type: String, required: true },
    description: { type: String },
    platform: {
      type: String,
      enum: ["google-meet", "zoom", "other"],
      default: "other",
    },
    link: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number },
    audience: {
      type: String,
      enum: ["all", "selected"],
      default: "all",
    },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Class = model<IClass>("Class", classSchema);
