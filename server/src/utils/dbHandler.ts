import { RequestHandler, Request, Response, NextFunction } from "express";

export const dbHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};
