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
class TweetService {
    static createTweet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rateLimitFlag = yield redis_1.redisClient.get(`RATE_LIMIT:TWEET:${data.userId}`);
            if (rateLimitFlag)
                throw new Error("Please wait....");
            const tweet = yield db_1.prismaClient.tweet.create({
                data: {
                    content: data.content,
                    imageURL: data.imageURL,
                    author: { connect: { id: data.userId } },
                },
            });
            yield redis_1.redisClient.setex(`RATE_LIMIT:TWEET:${data.userId}`, 10, 1);
            yield redis_1.redisClient.del("ALL_TWEETS");
            return tweet;
        });
    }
    static addCommentToTweet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the comment in the database
            const comment = yield db_1.prismaClient.comment.create({
                data: {
                    content: data.content,
                    user: { connect: { id: data.userId } },
                    tweet: { connect: { id: data.tweetId } },
                },
            });
            // Set a rate limit for the user to prevent spamming comments
            yield redis_1.redisClient.setex(`RATE_LIMIT:COMMENT:${data.userId}`, 10, "1");
            // Optional: Invalidate a cache for comments if you have it
            yield redis_1.redisClient.del(`COMMENTS_FOR_TWEET:${data.tweetId}`);
            return comment;
        });
    }
    static getAllTweets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.redisClient.del("ALL_TWEETS");
            const cachedTweets = yield redis_1.redisClient.get("ALL_TWEETS");
            if (cachedTweets)
                return JSON.parse(cachedTweets);
            const tweets = yield db_1.prismaClient.tweet.findMany({
                orderBy: { createdAt: "desc" },
            });
            yield redis_1.redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
            return tweets;
        });
    }
    static getTweetById(id) {
        return db_1.prismaClient.tweet.findUnique({ where: { id } });
    }
    static userHasLikedTweet(userId, tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield db_1.prismaClient.like.findFirst({
                where: {
                    userId: userId,
                    tweetId: tweetId,
                },
            });
            return like !== null;
        });
    }
    static getAllComments(tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            let like = [];
            like = yield db_1.prismaClient.comment.findMany({
                where: {
                    tweetId: tweetId,
                },
            });
            return like;
        });
    }
    static likeTweet(userId, tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.like.create({
                data: {
                    user: { connect: { id: userId } },
                    tweet: { connect: { id: tweetId } },
                },
            });
        });
    }
    static unlikeTweet(userId, tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.prismaClient.like.delete({
                where: { userId_tweetId: { userId: userId, tweetId: tweetId } },
            });
        });
    }
    static deleteTweet(userId, tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the tweet belongs to the user
            const tweet = yield db_1.prismaClient.tweet.findFirst({
                where: {
                    id: tweetId,
                    authorId: userId, // Assuming your Tweet model has a userId field
                },
            });
            // If the tweet exists and belongs to the user, delete it
            if (tweet) {
                this.unlikeTweet(userId, tweetId);
                return db_1.prismaClient.tweet.delete({
                    where: {
                        id: tweetId,
                    },
                });
            }
            else {
                throw new Error("Tweet not found or doesn't belong to the user.");
            }
        });
    }
}
exports.default = TweetService;
