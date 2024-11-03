import { graphqlClient } from "@/clients/api";
import { CreatePostData, CreateCommentData } from "@/gql/graphql";
import { createPostMutation, addCommentToPostMutation, deleteCommentsMutation } from "@/graphql/mutation/post";
import { getAllPostsQuery } from "@/graphql/query/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAllCommentsQuery, getTotalLikesForPostQuery} from "@/graphql/query/post";
import { deletePostMutation } from "@/graphql/mutation/post";
import { deleteSingleCommentMutation } from "@/graphql/mutation/post";

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
      graphqlClient.request(deletePostMutation, { postId }),
    onMutate: (payload) => toast.loading("Deleting Post", { id: "1" }),
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries(["all-posts"]);
      toast.success("Deleted Post", { id: "1" });
    },
  });
  return mutation;
};

export const useDeleteComment = (onSuccessCallback: any) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      graphqlClient.request(deleteSingleCommentMutation, { postId, commentId }),
    onMutate: () => {
      toast.loading("Deleting Comment...", { id: "1" });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["all-posts"]);
      toast.success("Deleted Comment", { id: "1" });
      if (onSuccessCallback) {
        onSuccessCallback(); 
      }
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
};

export const useGetTotalLikesForPost = (postId:any) => {
  return useQuery(
    ['total-likes', postId],
    async () => {
      const response = await graphqlClient.request(getTotalLikesForPostQuery, { postId });
      return response.getTotalLikesForPost || { totalCount: 0, users: [] }; 
    },
    {
      enabled: !!postId, 
      onError: (error) => {
        console.error("Error fetching total likes:", error);
      }
    }
  );
};


export const useGetAllComments = (postId: string) => {
  return useQuery(
    ['all-comments', postId],
    async () => {
      const response = await graphqlClient.request(getAllCommentsQuery, { postId:postId });
      return response.getAllComments || []; 
    },
    {
      enabled: !!postId, 
      onError: (error) => {
        console.error("Error fetching comments:", error);
      }
    }
  );
};
export const useGetAllPosts = () => {
  const query = useQuery({
    queryKey: ["all-posts"],
    queryFn: () => graphqlClient.request(getAllPostsQuery),
  });
  return { ...query, posts: query.data?.getAllPosts };
};
