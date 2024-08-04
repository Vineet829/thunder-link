import React, { useCallback, useState } from "react";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCreatePost, useGetAllPosts } from "@/hooks/post";
import { Post } from "@/gql/graphql";
import Postlayout from "@/components/FeedCard/Layout/PostLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllPostsQuery, getSignedURLForPostQuery } from "@/graphql/query/post";
import axios from "axios";
import { toast } from "react-hot-toast";

interface HomeProps {
  posts?: Post[];
}


export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  const { posts = props.posts as Post[] } = useGetAllPosts();
  const { mutateAsync } = useCreatePost();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;

      const { getSignedURLForPost } = await graphqlClient.request(
        getSignedURLForPostQuery,
        {
          imageName: file.name,
          imageType: file.type,
        }
      );

      if (getSignedURLForPost) {
        toast.loading("Uploading...", { id: "2" });
        await axios.put(getSignedURLForPost, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        toast.success("Upload Completed", { id: "2" });
        const url = new URL(getSignedURLForPost);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFn = handleInputChangeFile(input);

    input.addEventListener("change", handlerFn);

    input.click();
  }, [handleInputChangeFile]);

  const handleCreatePost = useCallback(async () => {
    await mutateAsync({
      content,
      imageURL,
    });
    setContent("");
    setImageURL("");
  }, [mutateAsync, content, imageURL]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Postlayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={40}
                    width={40}
                  />
                )}
              </div>
              <div className="flex-grow">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-sm border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {imageURL && (
                  <div className="mt-2">
                    <Image
                      src={imageURL}
                      alt="post-image"
                      width={300}
                      height={300}
                      className="rounded-md"
                    />
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <BiImageAlt
                    onClick={handleSelectImage}
                    className="text-2xl text-gray-500 hover:text-blue-500 cursor-pointer transition-colors"
                  />
                  <button
                    onClick={handleCreatePost}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all text-sm"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {posts?.map((post) =>
              post ? <FeedCard key={post.id} data={post as Post} /> : null
            )}
          </div>
        </div>
      </Postlayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const allPosts = await graphqlClient.request(getAllPostsQuery);
  return {
    props: {
      posts: allPosts.getAllPosts as Post[],
    },
  };
};
