/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  #graphql\n  mutation likePost($postId: ID!) {\n    likePost(postId: $postId)\n  }\n": types.LikePostDocument,
    "\n  #graphql\n  mutation UnlikePost($postId: ID!) {\n    unlikePost(postId: $postId)\n  }\n": types.UnlikePostDocument,
    "\n  #graphql\n  mutation CreatePost($payload: CreatePostData!) {\n    createPost(payload: $payload) {\n      id\n    }\n  }\n": types.CreatePostDocument,
    "\n#graphql\nmutation addCommentToPost($payload: CreateCommentData!) {\n  addCommentToPost(payload: $payload) {\n    id\n  }\n}\n": types.AddCommentToPostDocument,
    "\n  #graphql\n  mutation userHasLikedPost($postId: ID!) {\n    userHasLikedPost(postId: $postId)\n  }    \n      \n": types.UserHasLikedPostDocument,
    "\n  #graphql\n  mutation deletePost($postId: ID!) {\n    deletePost(postId: $postId)\n  }\n": types.DeletePostDocument,
    "\n  #graphql\n  mutation deleteComments($postId: ID!) {\n    deleteComments(postId: $postId)\n  }\n": types.DeleteCommentsDocument,
    "\n  #graphql\n  mutation deleteLikes($postId: ID!) {\n    deleteLikes(postId: $postId)\n  }\n": types.DeleteLikesDocument,
    "\n  #graphql\n  mutation deleteSingleComment($postId: ID!, $commentId: ID!) {\n    deleteSingleComment(postId: $postId, commentId: $commentId)\n  }\n": types.DeleteSingleCommentDocument,
    "\n  #graphql\n  mutation FollowUser($to: ID!) {\n    followUser(to: $to)\n  }\n": types.FollowUserDocument,
    "\n  #graphql\n  mutation UnfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n": types.UnfollowUserDocument,
    "\n  #graphql\n\n  query GetAllPosts {\n    getAllPosts {\n      id\n      content\n      imageURL\n      author {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n    }\n  }\n": types.GetAllPostsDocument,
    "\n  #graphql\n  query getPostById($id: ID!) {\n    getPostById(id: $id) {\n      id\n      \n    }  \n  }    \n      \n": types.GetPostByIdDocument,
    "\n  query GetSignedURL($imageName: String!, $imageType: String!) {\n    getSignedURLForPost(imageName: $imageName, imageType: $imageType)\n  }\n": types.GetSignedUrlDocument,
    "\nquery getAllComments($postId: ID!){\n  getAllComments(postId: $postId){\n    id\n    content\n    user{\n      id\n      profileImageURL\n    }\n  }\n}\n\n\n": types.GetAllCommentsDocument,
    "\n  #graphql\n  query VerifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": types.VerifyUserGoogleTokenDocument,
    "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      profileImageURL\n      email\n      firstName\n      lastName\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      followers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      posts {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      firstName\n      lastName\n      profileImageURL\n\n      followers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      posts {\n        content\n        id\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n": types.GetUserByIdDocument,
    "\n  #graphql\n\n  query getAllUsers {\n    getAllUsers {\n      id\n      firstName\n      \n    }\n  }\n": types.GetAllUsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation likePost($postId: ID!) {\n    likePost(postId: $postId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation likePost($postId: ID!) {\n    likePost(postId: $postId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation UnlikePost($postId: ID!) {\n    unlikePost(postId: $postId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation UnlikePost($postId: ID!) {\n    unlikePost(postId: $postId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation CreatePost($payload: CreatePostData!) {\n    createPost(payload: $payload) {\n      id\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation CreatePost($payload: CreatePostData!) {\n    createPost(payload: $payload) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n#graphql\nmutation addCommentToPost($payload: CreateCommentData!) {\n  addCommentToPost(payload: $payload) {\n    id\n  }\n}\n"): (typeof documents)["\n#graphql\nmutation addCommentToPost($payload: CreateCommentData!) {\n  addCommentToPost(payload: $payload) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation userHasLikedPost($postId: ID!) {\n    userHasLikedPost(postId: $postId)\n  }    \n      \n"): (typeof documents)["\n  #graphql\n  mutation userHasLikedPost($postId: ID!) {\n    userHasLikedPost(postId: $postId)\n  }    \n      \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation deletePost($postId: ID!) {\n    deletePost(postId: $postId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation deletePost($postId: ID!) {\n    deletePost(postId: $postId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation deleteComments($postId: ID!) {\n    deleteComments(postId: $postId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation deleteComments($postId: ID!) {\n    deleteComments(postId: $postId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation deleteLikes($postId: ID!) {\n    deleteLikes(postId: $postId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation deleteLikes($postId: ID!) {\n    deleteLikes(postId: $postId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation deleteSingleComment($postId: ID!, $commentId: ID!) {\n    deleteSingleComment(postId: $postId, commentId: $commentId)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation deleteSingleComment($postId: ID!, $commentId: ID!) {\n    deleteSingleComment(postId: $postId, commentId: $commentId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation FollowUser($to: ID!) {\n    followUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation FollowUser($to: ID!) {\n    followUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation UnfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation UnfollowUser($to: ID!) {\n    unfollowUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  query GetAllPosts {\n    getAllPosts {\n      id\n      content\n      imageURL\n      author {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n\n  query GetAllPosts {\n    getAllPosts {\n      id\n      content\n      imageURL\n      author {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getPostById($id: ID!) {\n    getPostById(id: $id) {\n      id\n      \n    }  \n  }    \n      \n"): (typeof documents)["\n  #graphql\n  query getPostById($id: ID!) {\n    getPostById(id: $id) {\n      id\n      \n    }  \n  }    \n      \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSignedURL($imageName: String!, $imageType: String!) {\n    getSignedURLForPost(imageName: $imageName, imageType: $imageType)\n  }\n"): (typeof documents)["\n  query GetSignedURL($imageName: String!, $imageType: String!) {\n    getSignedURLForPost(imageName: $imageName, imageType: $imageType)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery getAllComments($postId: ID!){\n  getAllComments(postId: $postId){\n    id\n    content\n    user{\n      id\n      profileImageURL\n    }\n  }\n}\n\n\n"): (typeof documents)["\nquery getAllComments($postId: ID!){\n  getAllComments(postId: $postId){\n    id\n    content\n    user{\n      id\n      profileImageURL\n    }\n  }\n}\n\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query VerifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query VerifyUserGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      profileImageURL\n      email\n      firstName\n      lastName\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      followers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      posts {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      profileImageURL\n      email\n      firstName\n      lastName\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      followers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      posts {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      firstName\n      lastName\n      profileImageURL\n\n      followers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      posts {\n        content\n        id\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      firstName\n      lastName\n      profileImageURL\n\n      followers {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImageURL\n      }\n      posts {\n        content\n        id\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageURL\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  query getAllUsers {\n    getAllUsers {\n      id\n      firstName\n      \n    }\n  }\n"): (typeof documents)["\n  #graphql\n\n  query getAllUsers {\n    getAllUsers {\n      id\n      firstName\n      \n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;