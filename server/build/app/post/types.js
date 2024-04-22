"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

    input CreatePostData {
        content: String!
        imageURL: String
    }
    input CreateCommentData {
  content: String!
  
  postId: ID!
}

 
    type Comment{
        id: ID!
        content: String!
        user: User
        
    }
    
    
    type Post {
        id: ID!
        content: String!
        imageURL: String
        likes: [User]   
        author: User
        comments: [User]
        
        
    }
`;
