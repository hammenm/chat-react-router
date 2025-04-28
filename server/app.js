import createError from "http-errors";
import cors from "cors";
import express from "express";
import conversationsRouter from "./routes/conversations.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/conversations", conversationsRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  const status = err.status || 500;
  res.status(status);
  res.json({
    status,
    detail: err.message,
    instance: req.url,
  });
});

export default app;
