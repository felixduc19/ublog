import { Context } from "../types/Context";
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-express";

export const CheckAuth: MiddlewareFn<Context> = async ({ context: { req } }, next) => {
  if (!req.session.userId) {
    console.log(req.session.userId);
    throw new AuthenticationError("Not authenticated");
  }

  return await next();
};
