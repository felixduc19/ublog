import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { LessThan } from "typeorm";
import { POST_LIMIT } from "../constant";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { CheckAuth } from "../middleware/checkAuth";
import { Context } from "../types/Context";
import { CreatePostInput } from "../types/CreatePostInput";
import { PaginatedPosts } from "../types/PaginatedPosts";
import { PostMutationResponse } from "../types/PostMutationResponse";
import { UpdatePostInput } from "../types/UpdatePostInput";

@Resolver((_of) => Post)
export class PostResolver {
  @FieldResolver((_return) => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 100);
  }

  @FieldResolver((_return) => User)
  async user(@Root() root: Post) {
    const user = await User.findOneBy({ id: root.userId });
    return user;
  }

  @Mutation((_returns) => PostMutationResponse)
  @UseMiddleware(CheckAuth)
  async createPost(
    @Ctx() { req }: Context,
    @Arg("createPostInput") createPostInput: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const { title, text } = createPostInput;
      const newPost = Post.create({
        title,
        text,
        userId: req.session.userId,
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

  @Query((_returns) => PaginatedPosts, { nullable: true })
  async posts(
    @Arg("limit", (_type) => Int) limit: number,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<PaginatedPosts | null> {
    try {
      const totalPostCount = await Post.count();

      const realLimit = Math.min(POST_LIMIT, limit);
      let lastPost: Post[] = [];

      const findOptions: { [key: string]: any } = {
        order: {
          createdAt: "desc",
        },
        take: realLimit,
      };

      if (cursor) {
        findOptions.where = {
          createdAt: LessThan(cursor),
        };

        lastPost = await Post.find({
          order: {
            createdAt: "asc",
          },
          take: 1,
        });
      }

      const posts = await Post.find(findOptions);

      return {
        cursor: posts[posts.length - 1].createdAt,
        totalCount: totalPostCount,
        hasMore:
          cursor && posts.length
            ? posts[posts.length - 1].createdAt.toString() !== lastPost[0].createdAt.toString()
            : posts.length !== totalPostCount,
        paginatedPosts: posts,
      };
    } catch (error) {
      return null;
    }
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
  async updatePost(
    @Ctx() { req }: Context,
    @Arg("updatePostInput") { id, title, text }: UpdatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOneBy({ id });

      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };
      }

      if (existingPost.userId !== req.session.userId) {
        return {
          code: 401,
          success: false,
          message: "Not authorized",
        };
      }

      existingPost.title = title;
      existingPost.text = text;

      await existingPost.save();

      return {
        code: 200,
        success: true,
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
  async deletePost(@Ctx() { req }: Context, @Arg("id") id: number): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOneBy({ id });
      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };
      }
      if (existingPost.userId !== req.session.userId) {
        return {
          code: 401,
          success: false,
          message: "Not authorized",
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
