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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../clients/db");
const redis_1 = require("../clients/redis");
class PostService {
    static createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rateLimitFlag = yield redis_1.redisClient.get(`RATE_LIMIT:POST:${data.userId}`);
            if (rateLimitFlag)
                throw new Error("Please wait....");
            const post = yield db_1.prismaClient.post.create({
                data: {
                    content: data.content,
                    imageURL: data.imageURL,
                    author: { connect: { id: data.userId } },
                },
            });
            yield redis_1.redisClient.setex(`RATE_LIMIT:POST:${data.userId}`, 10, 1);
            yield redis_1.redisClient.del("ALL_POSTS");
            return post;
        });
    }
    static addCommentToPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.prismaClient.comment.create({
                data: {
                    content: data.content,
                    user: { connect: { id: data.userId } },
                    post: { connect: { id: data.postId } },
                },
            });
            yield redis_1.redisClient.setex(`RATE_LIMIT:COMMENT:${data.userId}`, 10, "1");
            yield redis_1.redisClient.del(`COMMENTS_FOR_POST:${data.postId}`);
            return comment;
        });
    }
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.redisClient.del("ALL_POSTS");
            const cachedPosts = yield redis_1.redisClient.get("ALL_POSTS");
            if (cachedPosts)
                return JSON.parse(cachedPosts);
            const posts = yield db_1.prismaClient.post.findMany({
                orderBy: { createdAt: "desc" },
            });
            yield redis_1.redisClient.set("ALL_POSTS", JSON.stringify(posts));
            return posts;
        });
    }
    static getPostById(id) {
        return db_1.prismaClient.post.findUnique({ where: { id } });
    }
    static userHasLikedPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield db_1.prismaClient.like.findFirst({
                where: {
                    userId: userId,
                    postId: postId,
                },
            });
            return like !== null;
        });
    }
    static getAllComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let like;
            like = yield db_1.prismaClient.comment.findMany({
                where: {
                    postId: postId
                },
            });
            return like;
        });
    }
    static likePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.like.create({
                data: {
                    user: { connect: { id: userId } },
                    post: { connect: { id: postId } },
                },
            });
        });
    }
    static unlikePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.like.delete({
                where: { userId_postId: { userId: userId, postId: postId } },
            });
        });
    }
    static deleteComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.comment.deleteMany({
                where: {
                    postId: postId
                }
            });
        });
    }
    static deleteSingleComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.prismaClient.comment.findFirst({
                where: {
                    AND: [
                        { id: commentId },
                        { postId: postId },
                    ],
                }
            });
            if (comment) {
                yield db_1.prismaClient.comment.delete({
                    where: {
                        id: comment.id,
                    },
                });
            }
            else {
                throw new Error('Comment not found or does not match the specified criteria.');
            }
        });
    }
    static deleteLikes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.like.deleteMany({
                where: {
                    postId: postId
                }
            });
        });
    }
    static deletePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.prismaClient.post.findFirst({
                where: {
                    id: postId,
                    authorId: userId,
                },
            });
            if (post) {
                yield this.deleteLikes(postId);
                yield this.deleteComments(postId);
                return db_1.prismaClient.post.delete({
                    where: {
                        id: postId,
                    },
                });
            }
            else {
                throw new Error("Post not found or doesn't belong to the user.");
            }
        });
    }
}
exports.default = PostService;
