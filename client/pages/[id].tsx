import { useRouter } from "next/router";
import Postlayout from "@/components/FeedCard/Layout/PostLayout";
import Image from "next/image";
import type { GetServerSideProps, NextPage } from "next";
import { BsArrowLeftShort } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Post, User } from "@/gql/graphql";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";


import { useCallback, useMemo } from "react";
import {
  followUserMutation,
  unfollowUserMutation, 
} from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface ServerProps {
  userInfo?: User;  
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const amIFollowing = useMemo(() => {
    if (!props.userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el:any) => el?.id === props.userInfo?.id
      ) ?? -1) >= 0
    );
  }, [currentUser?.following, props.userInfo]);

  const handleFollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;

    await graphqlClient.request(followUserMutation, { to: props.userInfo?.id });
    await queryClient.invalidateQueries(["curent-user"]);
  }, [props.userInfo?.id, queryClient]);

  const handleUnfollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;

    await graphqlClient.request(unfollowUserMutation, {
      to: props.userInfo?.id,
    });
    await queryClient.invalidateQueries(["curent-user"]);
  }, [props.userInfo?.id, queryClient]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Postlayout>
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-3 py-3 px-3 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Link href="/">
              <BsArrowLeftShort className="text-4xl cursor-pointer text-gray-700 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>
              <h2 className="text-md font-bold text-gray-500 dark:text-gray-400">
                {props.userInfo?.posts?.length} Posts
              </h2>
            </div>
          </nav>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
            {props.userInfo?.profileImageURL && (
              <Image
                src={props.userInfo?.profileImageURL}
                alt="user-image"
                className="rounded-full mx-auto"
                width={100}
                height={100}
              />
            )}
            <h1 className="text-2xl font-bold text-center mt-5 text-gray-900 dark:text-gray-100">
              {props.userInfo?.firstName} {props.userInfo?.lastName}
            </h1>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{props.userInfo?.followers?.length} followers</span>
                <span>{props.userInfo?.following?.length} following</span>
              </div>
              {currentUser?.id !== props.userInfo?.id && (
                <>
                  {amIFollowing ? (
                    <button
                      onClick={handleUnfollowUser}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUser}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {props.userInfo?.posts?.map((post) => (
              <FeedCard data={post as Post} key={post?.id} />
            ))}
          </div>
        </div>
      </Postlayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;

  if (!id) return { notFound: true, props: { userInfo: undefined } };

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfilePage;
