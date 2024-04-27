import { graphql } from "@/gql";

export const likePostMutation = graphql(`
  #graphql
  mutation likePost($postId: ID!) {
    likePost(postId: $postId)
  }
`);



export const unlikePostMutation = graphql(`
  #graphql
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId)
  }
`);


export const createPostMutation = graphql(`
  #graphql
  mutation CreatePost($payload: CreatePostData!) {
    createPost(payload: $payload) {
      id
    }
  }
`);

export const addCommentToPostMutation = graphql(`
#graphql
mutation addCommentToPost($payload: CreateCommentData!) {
  addCommentToPost(payload: $payload) {
    id
  }
}
`);




export const userLikedPostMutation = graphql(`
  #graphql
  mutation userHasLikedPost($postId: ID!) {
    userHasLikedPost(postId: $postId)
  }    
      
`);



export const deletePostMutation = graphql(`
  #graphql
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`);

export const deleteCommentsMutation = graphql(`
  #graphql
  mutation deleteComments($postId: ID!) {
    deleteComments(postId: $postId)
  }
`);

export const deleteLikesMutation = graphql(`
  #graphql
  mutation deleteLikes($postId: ID!) {
    deleteLikes(postId: $postId)
  }
`);



export const deleteSingleCommentMutation = graphql(`
  #graphql
  mutation deleteSingleComment($postId: ID!, $commentId: ID!) {
    deleteSingleComment(postId: $postId, commentId: $commentId)
  }
`);
