import { catchAsync } from "../../utils/CatchAsync";
import sendResponse from "../../utils/SendResponse";
import { MailServices } from "./mails.service";
import httpStatus from "http-status";
import { Request, Response } from "express";

const createMail = catchAsync(async (req: Request, res: Response) => {
  const { subject, message } = req.body;
  const result = await MailServices.createMail(subject, message);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Emails successfully sent to all students",
    data: result,
  });
});

const getAllMails = catchAsync(async (req: Request, res: Response) => {
  const result = await MailServices.getAllMails();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Mails retrieved successfully",
    data: result,
  });
});

const createMailContact = async (req: Request, res: Response) => {
  try {
    const result = await MailServices.createMailContact(req.body);

    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to send mail",
    });
  }
};

export const MailController = {
  createMail,
  getAllMails,
  createMailContact
};
