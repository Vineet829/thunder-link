"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.muatations = void 0;
exports.muatations = `#graphql
    createPost(payload: CreatePostData!): Post
    likePost(postId: ID!): Boolean
    unlikePost(postId: ID!): Boolean
    userHasLikedPost(postId: ID!): Boolean
    
    addCommentToPost(payload: CreateCommentData!): Post
    deletePost(postId: ID!): Boolean  
    deleteComments(postId: ID!): Boolean  
    deleteLikes(postId: ID!): Boolean
    deleteSingleComment(postId: ID!, commentId: ID!): Boolean
`;
