import { Context } from "../types/Context";
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";

export const CheckAuth: MiddlewareFn<Context> = async ({ context: { req } }, next) => {
  if (!req.session.userId) {
    return new AuthenticationError("Not authenticated");
  }

  return await next();
};
