import { graphql } from "@/gql";

export const getAllPostsQuery = graphql(`
  #graphql
  query GetAllPosts {
    getAllPosts {
      id
      content
      imageURL
      author {
        id
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);

export const getPostByIdQuery = graphql(`
  #graphql
  query getPostById($id: ID!) {
    getPostById(id: $id) {
      id
      content
      imageURL
      author {
        id
        firstName
        lastName
        profileImageURL
      }
    }  
  }    
`);

export const getSignedURLForPostQuery = graphql(`
  #graphql
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForPost(imageName: $imageName, imageType: $imageType)
  }
`);

export const getAllCommentsQuery = graphql(`
  #graphql
  query getAllComments($postId: ID!) {
    getAllComments(postId: $postId) {
      id
      content
      user {
        id
        profileImageURL
      }
    }
  }
`);

export const getTotalLikesForPostQuery = graphql(`
  #graphql
 
  query GetTotalLikesForPost($postId: ID!) {
    getTotalLikesForPost(postId: $postId) {
        totalCount
        likes {
            user {
                id
                firstName
                lastName
                profileImageURL
            }
            createdAt
        }
    }
}

`);