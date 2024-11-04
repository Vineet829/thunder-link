import React, { useState } from 'react';
import { useCurrentUser } from "@/hooks/user";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDeleteComment } from '@/hooks/post';
import Image from "next/image";
import Link from "next/link"; 


const Comment = ({ commentLine = [], postId, deleteComment }: any) => { 
  const [viewMore, setViewMore] = useState(false);
  const { user } = useCurrentUser();
  const { mutate } = useDeleteComment(deleteComment);  

  const handleViewMore = () => {
    setViewMore(!viewMore);
  };

  const handleDeleteComment = async (commentId: any) => {
    try {
      await mutate({ postId, commentId });
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <>
      <ul className="list-none">
        {commentLine.slice(0, viewMore ? commentLine.length : 3).map((val: any) => (
          <li className='flex items-center gap-3 mb-4' key={val.id}>
            <Link href={`/${val.user.id}`}> 
              <Image
                className="rounded-full cursor-pointer" 
                src={val.user.profileImageURL}
                alt="user-image"
                height={30}
                width={30}
              />
            </Link>
            <div className="flex-1 w-16">
              <p className="break-words">{val.content}</p>
            </div>
            {user?.id === val.user?.id && (
              <div 
                onClick={() => handleDeleteComment(val.id)} 
                className='cursor-pointer text-gray-600 hover:text-red-600'
                aria-label="Delete comment" 
              >
                <MdOutlineDeleteOutline />
              </div>
            )}
          </li>
        ))}
      </ul>
    
      {commentLine.length > 3 && (
        <button onClick={handleViewMore} className="text-blue-500 underline">
          {viewMore ? 'View Less' : 'View More'}
        </button>
      )}
    </>
  );
};

export default Comment;
