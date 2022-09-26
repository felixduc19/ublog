import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { CheckAuth } from "../middleware/checkAuth";
import { Post } from "../entities/Post";
import { CreatePostInput } from "../types/CreatePostInput";
import { PostMutationResponse } from "../types/PostMutationResponse";
import { UpdatePostInput } from "../types/UpdatePostInput";

@Resolver()
export class PostResolver {
  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async createPost(@Arg("createPostInput") createPostInput: CreatePostInput): Promise<PostMutationResponse> {
    try {
      const { title, text } = createPostInput;
      const newPost = Post.create({
        title,
        text,
      });

      await newPost.save();

      return {
        code: 200,
        success: true,
        message: "Created post successfully",
        post: newPost,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }

  @Query((_returns) => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query((_return) => Post, { nullable: true })
  async post(@Arg("id", (_type) => ID) id: number): Promise<Post | null> {
    try {
      const post = await Post.findOneBy({ id });
      return post;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async updatePost(@Arg("updatePostInput") { id, title, text }: UpdatePostInput): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOneBy({ id });

      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };
      }

      existingPost.title = title;
      existingPost.text = text;

      await existingPost.save();

      return {
        code: 200,
        success: false,
        message: "Updated post successfully",
        post: existingPost,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async deletePost(@Arg("id") id: number): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOneBy({ id });
      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };
      }
      await Post.delete({ id });
      return {
        code: 200,
        success: true,
        message: "Deleted post successfully",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }
}
