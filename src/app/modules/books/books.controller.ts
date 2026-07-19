import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/CatchAsync";
import sendResponse from "../../utils/SendResponse";
import { BooksServices } from "./books.service";

const createBook = catchAsync(async (req: Request, res: Response) => {

  const payload = {
    ...req.body,
  };

  const result = await BooksServices.createBookDB(
    payload,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Book created successfully",
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BooksServices.getAllBooksDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully",
    data: result,
  });
});

const getSingleBooks = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BooksServices.getSingleBookDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully",
    data: result,
  });
});

const updateBooks = catchAsync(async (req: Request, res: Response) => {

  const result = await BooksServices.updateBookDB(
    req.params.id,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book updated successfully",
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BooksServices.softDeleteBookDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully",
    data: result,
  });
});

export const BooksController = {
  getAllBooks,
  getSingleBooks,
  createBook,
  updateBooks,
  deleteBook,
};
