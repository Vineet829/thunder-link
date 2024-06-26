"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.muatations = void 0;
exports.muatations = `#graphql
    createTweet(payload: CreateTweetData!): Tweet
    likeTweet(tweetId: ID!): Boolean
    unlikeTweet(tweetId: ID!): Boolean
    userHasLikedTweet(tweetId: ID!): Boolean
    deleteTweet(tweetId:ID!): Boolean
    addCommentToTweet(payload: CreateCommentData!): Tweet
`;
