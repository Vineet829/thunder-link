import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Post } from "@/gql/graphql";
import Link from "next/link";
import { deletePostMutation, likePostMutation, unlikePostMutation, userLikedPostMutation } from "@/graphql/mutation/post";
import { graphqlClient } from "@/clients/api";
import { useCreateComment, useGetAllComments, useGetTotalLikesForPost } from "../../hooks/post";
import CommentBox from "./CommentBox";
import { GoComment } from "react-icons/go";
import Comment from "./Comment";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useCurrentUser } from "@/hooks/user";
import { useDeletePost } from "@/hooks/post";

interface FeedCardProps {
  data: Post;
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
  const { mutateAsync } = useCreateComment();
  const { user } = useCurrentUser();
  const { mutate } = useDeletePost(data.id);
  const { data: comments, refetch: refetchComments } = useGetAllComments(data.id);
  const { data: totalLikesData, refetch: refetchLikes } = useGetTotalLikesForPost(data.id);
  const [commentLine, setCommentLine] = useState<any>([]);
  const [commentValue, setCommentValue] = useState<string>('');
  const [commentBoxStatus, setCommentBoxStatus] = useState(false);

  useEffect(() => {
    if (comments) {
      setCommentLine(comments);
    }
  }, [comments]);

  const handleCommentValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentValue(e.target.value);
  };

  const addCommentLine = () => {
    setCommentLine(commentLine);
    setCommentValue('');
  };

  const submitCommentLine = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleCreateComment();
    setCommentBoxStatus(!commentBoxStatus);
    addCommentLine();
  };

  const enterCommentLine = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateComment();
      setCommentBoxStatus(prevStatus => !prevStatus);
      addCommentLine();
    }
  };

  const handleCreateComment = useCallback(async () => {
    try {
      await mutateAsync({ content: commentValue, postId: data.id });
      refetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [mutateAsync, commentValue]);

  const [liked, setLiked] = useState(false);
  const toggleLike = () => setLiked(!liked);

  useEffect(() => {
    stateLike();
  }, [liked]);

  const stateLike = async () => {
    try {
      const result = await graphqlClient.request(userLikedPostMutation, { postId: data.id });
      if (result.userHasLikedPost && !liked) {
        toggleLike();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = async () => {
    await graphqlClient.request(likePostMutation, { postId: data.id });
    toggleLike();
    refetchLikes();
  };

  const handleUnlikePost = async () => {
    await graphqlClient.request(unlikePostMutation, { postId: data.id });
    toggleLike();
    refetchLikes();
  };

  const handleCommentClick = () => {
    setCommentBoxStatus(!commentBoxStatus);
  };

  const handleDeletePost = () => {
    mutate();
  };

  return (
    <div className="flex flex-nowrap card p-5 transition-all">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          {data.author?.profileImageURL && (
            <Link href={`/${data.author?.id}`}>
              <Image
                className="rounded-full cursor-pointer"
                src={data.author.profileImageURL}
                alt="user-image"
                height={50}
                width={50}
              />
            </Link>
          )}
        </div>
        <div className="col-span-11 ml-3">
          <div className="flex justify-between">
            <h5>
              <Link className="head text-2xl" href={`/${data.author?.id}`}>
                {data.author?.firstName} {data.author?.lastName}
              </Link>
            </h5>
            {user?.id === data.author?.id && (
              <span className="cursor-pointer" onClick={handleDeletePost}>
                <MdOutlineDeleteOutline className="text-3xl delete" />
              </span>
            )}
          </div>
          <p className="post-text text-xl mt-4 mb-4">{data.content}</p>
          {data.imageURL && (
            <Image style={{ borderRadius: "15px" }} src={data.imageURL} alt="image" width={700} height={700} />
          )}
          <div className="grid gap-4 row-span-12 mt-5 text-xl p-2 w-[90%]">
            <div className="flex items-center row-span-2">
              <span className="cursor-pointer" onClick={liked ? handleUnlikePost : handleLikePost}>
                {liked ? (
                  <AiFillHeart className="w-9 h-9 text-red-500 row-span-1" />
                ) : (
                  <AiOutlineHeart className="w-9 h-9 row-span-1" />
                )}
              </span>
              <span className="ml-4 cursor-pointer" onClick={handleCommentClick}>
                <GoComment className="w-8 h-8" />
              </span>
            </div>
            <div className="flex flex-row min-w-full gap-4 items-center mt-1">
              {totalLikesData?.totalCount !== undefined && totalLikesData.totalCount > 0 && (
                <div className="mt-1 text-l">
                  {totalLikesData.totalCount === 1 ? "1 like" : `${totalLikesData.totalCount} likes`}
                </div>
              )}
              <div className="flex mt-1 overflow-x-auto space-x-2">
                {totalLikesData?.likes?.map((user: any) => (
                  user.user.profileImageURL && (
                    <Link key={user.user.id} href={`/${user.user.id}`}>
                      <Image
                        className="rounded-full border-2 border-white cursor-pointer"
                        src={user.user.profileImageURL}
                        alt={`${user.user.firstName} ${user.user.lastName}`}
                        height={30}
                        width={30}
                      />
                    </Link>
                  )
                ))}
              </div>
            </div>
            <div className="row-span-2">
              {commentBoxStatus && (
                <CommentBox
                  commentValue={commentValue}
                  handleCommentValue={handleCommentValue}
                  enterCommentLine={enterCommentLine}
                  submitCommentLine={submitCommentLine}
                />
              )}
            </div>
            <div className="max-w-full">
    <Comment commentLine={commentLine} deleteComment={refetchComments} postId={data.id} />
  </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
