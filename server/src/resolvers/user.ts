import argon2 from "argon2";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { User } from "../entities/User";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/ValidateRegisterInput";
import { LoginInput } from "../types/LoginInput";

@Resolver()
export class UserResolver {
  @Query((_return) => UserMutationResponse, { nullable: true })
  // async me(@Ctx() { req }: any): Promise<User | undefined | null> {
  //   if (!req.session.userId) return null;
  //   const user = await User.findOne(req.session.userId);
  //   return user;
  // }
  @Mutation((_returns) => UserMutationResponse)
  async register(@Arg("registerInput") registerInput: RegisterInput): Promise<UserMutationResponse | null> {
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

      const newUser = User.create({
        username,
        email,
        password: hashPassword,
      });

      return {
        code: 200,
        success: true,
        message: "User registration successful",
        user: await User.save(newUser),
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
  async login(@Arg("loginInput") loginInput: LoginInput): Promise<UserMutationResponse> {
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
}
