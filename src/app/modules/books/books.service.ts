// services/books.service.ts
import { IBook } from "./books.interface";
import { Book } from "./books.model";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploadToCloudinary";
import ApiError from "../../utils/AppError";
import httpStatus from "http-status";

const getAllBooksDB = async () => {
  return await Book.find({ isDeleted: false });
};

const getSingleBookDB = async (id: string) => {
  const book = await Book.findOne({ _id: id, isDeleted: false });
  if (!book) {
    throw new Error("Book not found or has been deleted!");
  }
  return book;
};

const createBookDB = async (
  payload: IBook,
  file?: Express.Multer.File
) => {

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, "books");

    payload.cover = uploadResult.secure_url;
    payload.coverPublicId = uploadResult.public_id;
  }

  const result = await Book.create(payload);

  return result;
};

const updateBookDB = async (
  id: string,
  payload: Partial<IBook>,
  file?: Express.Multer.File
) => {
  const isBookExists = await Book.findById(id);

  if (!isBookExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book Not Found!");
  }

  if (file) {

    if (isBookExists.coverPublicId) {
      await deleteFromCloudinary(isBookExists.coverPublicId);
    }

    const uploadResult = await uploadToCloudinary(file.buffer, "books");

    payload.cover = uploadResult.secure_url;
    payload.coverPublicId = uploadResult.public_id;
  }

  const result = await Book.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const softDeleteBookDB = async (id: string) => {
  const deleted = await Book.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!deleted) {
    throw new Error("Unable to delete: book not found or already deleted!");
  }
  return deleted;
};

export const BooksServices = {
  getAllBooksDB,
  getSingleBookDB,
  createBookDB,
  updateBookDB,
  softDeleteBookDB,
};
