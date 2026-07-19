export interface ITeacher {
  name: string;
  email: string;
  number: string;
  education: string;
  subject: string[]; 
  gender: "male" | "female";
  profileImage?: string; 
  profileImagePublicId?: string; 
  isDeleted: boolean;
}