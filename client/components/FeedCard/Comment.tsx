import { getAllCommentsQuery } from '@/graphql/query/post';
import React, {useState} from 'react';
import { graphqlClient } from "@/clients/api";
import { useCurrentUser } from "@/hooks/user";
import { MdOutlineDeleteOutline } from "react-icons/md";
// Define the shape of each comment object
import { useDeleteComment } from '@/hooks/post';
import Image from "next/image";
const Comment = ({ commentLine, postId}:any) => {
  const [viewMore, setViewMore] = useState(false);

  // Function to toggle view more state
  const handleViewMore = () => {
      setViewMore(!viewMore);
  };
  
  const { user } = useCurrentUser();
  const { mutate } = useDeleteComment();  
  
  const handleDeleteComment = (commentId:any) => {
    // Use the specific commentId here
    

    mutate({postId:postId,commentId:commentId})
   
  };
  
  return (
      <>
          <ul className="comments-list post-text">
              {/* Render only the first 3 comments initially, or all if viewMore is true */}
              {commentLine.slice(0, viewMore ? commentLine.length : 3).map((val: any) => (
                  <div className='flex items-center gap-3 mb-4'>
                  <div>
                  
                <Image
              
                className="rounded-full"
                  src={val.user.profileImageURL}
                  alt="user-image"
                  height={30}
                  width={30}
                />
              
                </div>
                  
                  
                  
                  <div><li className="each-comment" key={val.id}>
                      {val.content}
                  </li></div>
                  {user?.id == val.user?.id &&<div onClick={()=> handleDeleteComment(val.id)} className='ml-auto delete'><MdOutlineDeleteOutline/></div>}
              </div>
              
              
              
              ))}
          </ul>
          {/* Show the View More button only if there are more than 3 comments */}
          {commentLine.length > 3 && (
              <button onClick={handleViewMore} className="view-more-button">
                  {viewMore ? 'View Less' : 'View More'}
              </button>
          )}
      </>
  );
};

export default Comment;