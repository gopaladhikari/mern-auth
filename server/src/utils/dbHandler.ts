import { RequestHandler, Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../models/models";

export const dbHandler = (requestHandler: RequestHandler) => {
  return (req: Request | RequestWithUser, res: Response, next: NextFunction) =>
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};
