import { graphqlClient } from "@/clients/api";
import { CreatePostData, CreateCommentData } from "@/gql/graphql";
import { createPostMutation, addCommentToPostMutation, deleteCommentsMutation } from "@/graphql/mutation/post";
import { getAllPostsQuery } from "@/graphql/query/post";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllCommentsQuery } from "@/graphql/query/post";
import { deletePostMutation } from "@/graphql/mutation/post";
import {deleteSingleCommentMutation} from "@/graphql/mutation/post"





export const useCreatePost = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreatePostData) =>
      graphqlClient.request(createPostMutation, { payload }),
    onMutate: (payload) => toast.loading("Creating Post", { id: "1" }),
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries(["all-posts"]);
      toast.success("Created Success", { id: "1" });
    },
  });

  return mutation;
};

export const useDeletePost = (postId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      graphqlClient.request(deletePostMutation, { postId}),
    onMutate: (payload) => toast.loading("Deleting Post", { id: "1" }),
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries(["all-posts"]);
      toast.success("Deleted Post", { id: "1" });
    },
  });

  return mutation;
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // Directly use postId and commentId as arguments
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      graphqlClient.request(deleteSingleCommentMutation, { postId, commentId }),
    onMutate: () => {
      toast.loading("Deleting Comment...", { id: "1" });
    },
    onSuccess: async () => {
     
      await queryClient.invalidateQueries(["all-posts"]);


      toast.success("Deleted Comment", { id: "1" });
    
    }
  });

  return mutation;
};


export const useCreateComment = () => {
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (payload: CreateCommentData) =>
    graphqlClient.request(addCommentToPostMutation, { payload }),
  onMutate: (payload) => toast.loading("Adding Comment", { id: "1" }),
  onSuccess: async (payload) => {
    await queryClient.invalidateQueries(["all-posts"]);

    toast.success("Added Comment", { id: "1" });
  },
});

return mutation;
}

export const useGetAllComments = (postId:any) => {
  const query = useQuery([`all-comments`], async () => {
    // Ensure postId is used directly in the request
    return await graphqlClient.request(getAllCommentsQuery, { postId });
  
  });

  // Directly return the query object and a more accessible comments property
  return {...query, comments: query.data?.getAllComments };
};


export const useGetAllPosts = () => {
  const query = useQuery({
    queryKey: ["all-posts"],
    queryFn: () => graphqlClient.request(getAllPostsQuery),

  });
  return { ...query, posts: query.data?.getAllPosts };
};
