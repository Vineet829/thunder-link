import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCreatePost, useGetAllPosts } from "@/hooks/post";
import { Post } from "@/gql/graphql";
import Postlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { BsSend } from "react-icons/bs";

 import {getAllPostsQuery,
  getSignedURLForPostQuery, 
} from "@/graphql/query/post";

import {userLikedPostMutation} from  "@/graphql/mutation/post"

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

  
  

  
   
  // border border-r-0 border-l-0 border-b-0 border-gray-600 
  
  
  return (
    <div>
      <Postlayout>
        <div> 
        <div>
          <div className="card p-5 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3" >
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {imageURL && (
                  <Image
                    src={imageURL}
                    alt="post-image"
                    width={300}
                    height={300}
                  />
                )}
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt onClick={handleSelectImage} className="text-3xl" />
                 <button className="button-30" onClick={handleCreatePost} >
                   
                Post
                 </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
       
        {posts?.map((post) =>
          post ? <FeedCard key={post?.id} data={post as Post} /> : null
        )}
        
        </div>
      </Postlayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const allPosts = await graphqlClient.request(getAllPostsQuery);
  
  
  return {
    props: {
      posts: allPosts.getAllPosts as Post[],
      
    },
  };
};
