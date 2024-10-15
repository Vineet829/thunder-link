import { Post } from "@prisma/client";
import { Comment } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../intefaces";
import UserService from "../../services/user";
import PostService, { CreatePostPayload, CreateCommentData } from "../../services/post";

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
});

const queries = {
  getAllPosts: () => PostService.getAllPosts(),
  
  getSignedURLForPost: async (
    parent: any,
    { imageType, imageName }: { imageType: string; imageName: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    const allowedImageTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedImageTypes.includes(imageType))
      throw new Error("Unsupported Image Type");

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      ContentType: imageType,
      Key: `uploads/${ctx.user.id}/posts/${imageName}-${Date.now()}`,
    });

    const signedURL = await getSignedUrl(s3Client, putObjectCommand);
    return signedURL;
  },
  
  getPostById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => PostService.getPostById(id),

  getAllComments: (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("User not authenticated");
    }

    const comments = PostService.getAllComments(postId);
    return comments;
  },

  getTotalLikesForPost: async (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => PostService.getTotalLikesForPost(postId),
};

const mutations = {
  createPost: async (
    parent: any,
    { payload }: { payload: CreatePostPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    const post = await PostService.createPost({
      ...payload,
      userId: ctx.user.id
    });

    return post;
  },

  addCommentToPost: async (
    parent: any,
    { payload }: { payload: CreateCommentData },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");

    const comment = await PostService.addCommentToPost({
      content: payload.content,
      postId: payload.postId,
      userId: ctx.user.id
    });

    return comment;
  },

  likePost: async (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

    await PostService.likePost(ctx.user.id, postId);
    return true;
  },

  unlikePost: async (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

    await PostService.unlikePost(ctx.user.id, postId);
    return true;
  },

  deleteSingleComment: async (
    parent: any,
    { postId, commentId }: { postId: string, commentId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

    await PostService.deleteSingleComment(postId, commentId);
    return true;
  },

  userHasLikedPost: async (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("User not authenticated");
    }

    const hasLiked = await PostService.userHasLikedPost(ctx.user.id, postId);
    return hasLiked;
  },

  deleteLikes: async (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

    await PostService.deleteLikes(postId);
    return true;
  },

  deleteComments: async (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

    await PostService.deleteComments(postId);
    return true;
  },

  deletePost: async (
    parent: any,
    { postId }: { postId: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

    await PostService.deletePost(ctx.user.id, postId);
    return true;
  },
};

const extraResolvers = {
  Comment: {
    user: (parent: Comment) => UserService.getUserById(parent.userId),
  },
  Post: {
    author: (parent: Post) => UserService.getUserById(parent.authorId),

    likes: async (parent: Post) => {
      const result = await prismaClient.like.findMany({
        where: { post: { id: parent.id } },
        include: {
          user: true,
        },
      });
      return result.map((el) => el.user);
    }
  }
};

export const resolvers = { mutations, extraResolvers, queries };
