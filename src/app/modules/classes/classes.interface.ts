import { Types } from "mongoose";

export type TClassPlatform = "google-meet" | "zoom" | "other";

/**
 * "all"      -> every student sees the class
 * "selected" -> only the students listed in `students` see it
 */
export type TClassAudience = "all" | "selected";

export interface IClass {
  title: string;
  description?: string;
  platform: TClassPlatform;
  link: string;
  scheduledAt: Date;
  durationMinutes?: number;
  audience: TClassAudience;
  students: Types.ObjectId[];
  isDeleted: boolean;
}
