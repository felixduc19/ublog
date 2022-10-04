import argon2 from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserMutationResponse } from "../types/UserMutationResponse";
import crypto from "crypto";

import { COOKIE_NAME } from "../constant";
import { User } from "../entities/User";
import { Context } from "../types/Context";
import { LoginInput } from "../types/LoginInput";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/ValidateRegisterInput";
import { ForgotPasswordInput } from "../types/ForgotPasswordInput";
import { sendEmail } from "../utils/sendEmail";
import { TokenModel } from "../models/Token";
import { ChangePasswordInput } from "../types/ChangePasswordInput";

@Resolver()
export class UserResolver {
  @Query((_return) => User, { nullable: true })
  async me(@Ctx() { req }: any): Promise<User | undefined | null> {
    if (!req.session.userId) return null;
    const user = await User.findOneBy({ id: req.session.userId });
    return user;
  }
  @Mutation((_returns) => UserMutationResponse)
  async register(
    @Arg("registerInput") registerInput: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse | null> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput);
    if (validateRegisterInputErrors) {
      return {
        code: 400,
        success: false,
        ...validateRegisterInputErrors,
      };
    }

    try {
      const { username, email, password } = registerInput;
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      });
      if (existingUser) {
        const takenField = existingUser.username === username ? "username" : "email";
        return {
          code: 400,
          success: false,
          message: "Dupilcated username or email ",
          errors: [
            {
              field: takenField,
              message: `${takenField} already taken`,
            },
          ],
        };
      }

      const hashPassword = await argon2.hash(password);

      let newUser = User.create({
        username,
        email,
        password: hashPassword,
      });

      newUser = await User.save(newUser);

      req.session.userId = newUser.id;

      return {
        code: 200,
        success: true,
        message: "User registration successful",
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }
  @Mutation((_returns) => UserMutationResponse)
  async login(@Arg("loginInput") loginInput: LoginInput, @Ctx() { req }: Context): Promise<UserMutationResponse> {
    try {
      const { usernameOrEmail, password } = loginInput;
      const existingUser = await User.findOneBy(
        usernameOrEmail.includes("@") ? { email: usernameOrEmail } : { username: usernameOrEmail }
      );
      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: "User not found",
          errors: [
            {
              field: "usernameOrEmail",
              message: "Username or email incorrect",
            },
          ],
        };
      }

      const passwordValid = await argon2.verify(existingUser.password, password);

      if (!passwordValid) {
        return {
          code: 400,
          success: false,
          message: "Password incorrect",
          errors: [
            {
              field: "password",
              message: "Password incorrect",
            },
          ],
        };
      }

      req.session.userId = existingUser.id;

      return {
        code: 200,
        success: true,
        message: "Login successful",
        user: existingUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }

  @Mutation((_returns) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);
      req.session.destroy((error) => {
        if (error) {
          console.log("Destroy session error");
          resolve(false);
        }

        resolve(true);
      });
    });
  }

  @Mutation((_returns) => Boolean)
  async forgotPassword(@Arg("forgotPasswordInput") forgotPasswordInput: ForgotPasswordInput): Promise<boolean> {
    try {
      const user = await User.findOneBy({ email: forgotPasswordInput.email });
      if (!user) return true;
      let resetToken = crypto.randomBytes(32).toString("hex");

      const hashResetToken = await argon2.hash(resetToken);

      await TokenModel.findOneAndDelete({ userId: `${user.id}` });

      await new TokenModel({ userId: `${user.id}`, token: hashResetToken }).save();

      await sendEmail(
        forgotPasswordInput.email,
        `<a href="http://localhost:3000/auth/change-password?token=${resetToken}&userId=${user.id}">Click here to reset your password</a>`
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation((_returns) => UserMutationResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("userId") userId: string,
    @Arg("changePasswordInput") changePasswordInput: ChangePasswordInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      if (changePasswordInput.password.length < 6) {
        return {
          code: 400,
          success: false,
          message: "Invalid password",
          errors: [{ field: "password", message: "Length must be greater than 6" }],
        };
      }
      const resetPasswordToken = await TokenModel.findOne({ userId });
      if (!resetPasswordToken) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired reset password token",
          errors: [{ field: "token", message: "Invalid or expired reset password token" }],
        };
      }
      const resetPasswordTokenValid = await argon2.verify(resetPasswordToken.token, token);
      if (!resetPasswordTokenValid) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired reset password token",
          errors: [{ field: "token", message: "Invalid or expired reset password token" }],
        };
      }

      const user = await User.findOneBy({ id: parseInt(userId) });
      if (!user) {
        return {
          code: 400,
          success: false,
          message: "User no longer exists",
          errors: [{ field: "user", message: "User no longer exists" }],
        };
      }

      const updatePassword = await argon2.hash(changePasswordInput.password);

      await User.update(
        { id: parseInt(userId) },
        {
          password: updatePassword,
        }
      );

      await resetPasswordToken.deleteOne();
      req.session.userId = user?.id;
      return {
        code: 200,
        success: true,
        message: "User password reset successfully",
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }
}
