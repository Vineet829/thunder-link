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
      
    }  
  }    
      
`);




export const getSignedURLForPostQuery = graphql(`
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForPost(imageName: $imageName, imageType: $imageType)
  }
`);

export const getAllCommentsQuery = graphql(`
query getAllComments($postId: ID!){
  getAllComments(postId: $postId){
    id
    content
    user{
      id
      profileImageURL
    }
  }
}


`);