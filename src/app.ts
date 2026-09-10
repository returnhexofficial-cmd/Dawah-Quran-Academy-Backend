import cors from "cors";
import express from "express";
import { config } from "./app/config";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes/router";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";

const app = express();

// The refresh token travels in a cookie, so the browser needs an explicit
// origin plus Access-Control-Allow-Credentials. A wildcard origin makes the
// browser drop the cookie on credentialed requests.
const allowedOrigins = config.client_url
  .split(",")
  .map((origin: string) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

app.get("/", (req: Request, res: Response) => {
  res.send("Online Quran Teaching is on");
});
export default app;
