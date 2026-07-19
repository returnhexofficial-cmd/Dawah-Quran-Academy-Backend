import mongoose, { model, Schema } from "mongoose";
import { ITeacher } from "./teachers.interface";

const teacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    subject: {
      type: [String], 
      required: true,
      default: [],
    },
    education: { type: String },
    gender: { type: String, enum: ["male", "female"], required: true },
    profileImage: { type: String }, 
    profileImagePublicId: { type: String }, 
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Teacher = model<ITeacher>("Teacher", teacherSchema);