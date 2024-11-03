export const types = `#graphql

    input CreatePostData {
        content: String!
        imageURL: String
    }

    input CreateCommentData {
        content: String!
        postId: ID!
    }

    type PostLikes {
        totalCount: Int!
        likes: [Like]!
    }

    type Comment {
        id: ID!
        content: String!
        user: User
        post: Post
    }

    type Like {
        user: User
        post: Post
        createdAt: String
    }

    type Post {
        id: ID!
        content: String!
        imageURL: String
        likes: [Like]   
        author: User
        comments: [Comment] 
    }
`;
