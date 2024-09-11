"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const db_1 = require("../../clients/db");
const user_1 = __importDefault(require("../../services/user"));
const post_1 = __importDefault(require("../../services/post"));
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_DEFAULT_REGION,
});
const queries = {
    getAllPosts: () => post_1.default.getAllPosts(),
    getSignedURLForPost: (parent, { imageType, imageName }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthenticated");
        const allowedImageTypes = [
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/webp",
        ];
        if (!allowedImageTypes.includes(imageType))
            throw new Error("Unsupported Image Type");
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            ContentType: imageType,
            Key: `uploads/${ctx.user.id}/posts/${imageName}-${Date.now()}`,
        });
        const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
        return signedURL;
    }),
    getPostById: (parent, { id }, ctx) => __awaiter(void 0, void 0, void 0, function* () { return post_1.default.getPostById(id); }),
    getAllComments: (parent, { postId }, ctx) => {
        if (!ctx.user)
            throw new Error("User not authenticated");
        const comments = post_1.default.getAllComments(postId);
        return comments;
    }
};
const mutations = {
    createPost: (parent, { payload }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user)
            throw new Error("You are not authenticated");
        const post = yield post_1.default.createPost(Object.assign(Object.assign({}, payload), { userId: ctx.user.id }));
        return post;
    }),
    addCommentToPost: (parent, { payload }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user)
            throw new Error("You are not authenticated");
        const comment = yield post_1.default.addCommentToPost({
            content: payload.content,
            postId: payload.postId,
            userId: ctx.user.id
        });
        return comment;
    }),
    likePost: (parent, { postId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("unauthenticated");
        yield post_1.default.likePost(ctx.user.id, postId);
        return true;
    }),
    unlikePost: (parent, { postId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("unauthenticated");
        yield post_1.default.unlikePost(ctx.user.id, postId);
        return true;
    }),
    deleteSingleComment: (parent, { postId, commentId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("unauthenticated");
        yield post_1.default.deleteSingleComment(postId, commentId);
        return true;
    }),
    userHasLikedPost: (parent, { postId }, ctx) => {
        if (!ctx.user)
            throw new Error("User not authenticated");
        const hasLiked = post_1.default.userHasLikedPost(ctx.user.id, postId);
        return hasLiked;
    }),
    deleteLikes: (parent, { postId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("unauthenticated");
        yield post_1.default.deleteLikes(postId);
        return true;
    }),
    deleteComments: (parent, { postId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("unauthenticated");
        yield post_1.default.deleteComments(postId);
        return true;
    }),
    deletePost: (parent, { postId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id)
            throw new Error("unauthenticated");
        yield post_1.default.deletePost(ctx.user.id, postId);
        return true;
    }),
};
const extraResolvers = {
    Comment: {
        user: (parent) => user_1.default.getUserById(parent.userId),
    },
    Post: {
        author: (parent) => user_1.default.getUserById(parent.authorId),
        likes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield db_1.prismaClient.like.findMany({
                where: { post: { id: parent.id } },
                include: {
                    user: true,
                },
            });
            return result.map((el) => el.user);
        })
    }
};
exports.resolvers = { mutations, extraResolvers, queries };
