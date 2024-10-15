export const queries = `#graphql
    getAllPosts: [Post]
    getSignedURLForPost(imageName: String!, imageType: String!): String
    getPostById(id: ID!): Post
    getAllComments(postId: ID!): [Comment]
    getTotalLikesForPost(postId: ID!): Int
`;
