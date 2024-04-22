"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

    input CreateTweetData {
        content: String!
        imageURL: String
    }
    input CreateCommentData {
  content: String!
  
  tweetId: ID!
}

 
    type Comment{
        id: ID!
        content: String!
        user: User
        
    }
    
    
    type Tweet {
        id: ID!
        content: String!
        imageURL: String
        likes: [User]   
        author: User
        comments: [User]
        
        
    }
`;
