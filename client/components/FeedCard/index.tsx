import React, {useState, useEffect, useCallback} from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Post } from "@/gql/graphql";
import Link from "next/link";
import {deletePostMutation, likePostMutation, unlikePostMutation, userLikedPostMutation} from "@/graphql/mutation/post"
import { graphqlClient } from "@/clients/api";

import { setServers } from "dns";
import { useCreateComment } from "@/hooks/post";

import CommentBox from "./CommentBox";
import { GoComment } from "react-icons/go";
import Comment from "./Comment";
import { getAllCommentsQuery} from "@/graphql/query/post";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useCurrentUser } from "@/hooks/user";
import { useDeletePost } from "@/hooks/post";




interface FeedCardProps {
  data: Post;
}

const FeedCard: React.FC<FeedCardProps> = (props) => { 
  
    


  const { data } = props;
  
  const { mutateAsync } = useCreateComment()
  const { user } = useCurrentUser();
  const {mutate} =    useDeletePost(data.id);
 
  
    const [commentLine, setCommentLine] = useState<any>([]);
    const [commentValue, setCommentValue] = useState<string>('');
  
    const [commentBoxStatus, setCommentBoxStatus] = useState(false)
    
 
  

  useEffect(() => {
    (async () => {
      try {
        // await async "fetchBooks()" function
        const books = await graphqlClient.request(getAllCommentsQuery, {postId:data.id}) ;
        
        setCommentLine(books.getAllComments);
      } catch (err) {
        console.log('Error occured when fetching books');
      }
    })();
  }, [commentLine]);        
  
  
  
  const handleCommentValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Use setCommentValue to update the commentValue state with the new input value
    setCommentValue(e.target.value);
  };



  const addCommentLine = () => {
    setCommentLine(commentLine)
   
    setCommentValue(''); // Reset the comment input value
  };
    
  const submitCommentLine = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("Before handleCreateComment");
    handleCreateComment();
    setCommentBoxStatus(!commentBoxStatus)
    console.log("After handleCreateComment");
    addCommentLine();
  };
  
  
  const enterCommentLine = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13) { // 13 is the charCode for Enter key
      e.preventDefault(); // Prevent the default action to avoid form submission or line break
      handleCreateComment()
      setCommentBoxStatus(!commentBoxStatus)
      addCommentLine();
    }
  };
  







  


const handleCreateComment = useCallback(async () => {
      try {
        await mutateAsync({content: commentValue, postId:data.id});
        
        // Optionally, handle any additional state updates upon success
      } catch (error) {
        // Error handling if needed
        console.error('Failed to add comment:', error);
      }
    }, [mutateAsync, commentValue]);
  

  
  
   
  
  
  
  const [liked, setLiked] = useState(false);
  const toggleLike = () =>{
    setLiked(!liked)
  }
 
  const [commentStatus, setCommentStatus] = useState(false)
  
  
  
  
  useEffect(() => {
    stateLike()
  }
  ,[liked])

    
  
  
  
  
  const stateLike = async () => {
    
        
        try{
          const result = await graphqlClient.request(userLikedPostMutation, { postId:data.id });
        if(result.userHasLikedPost && !liked){
          toggleLike()
        }
        else{
          return
        }
      }
      catch(error){
        console.log(error)
      }
       
    }
    


  
 
  
  const handleLikePost =async () => {
    
    
    await graphqlClient.request(likePostMutation, { postId: data.id });
    toggleLike()
    
  };
  
  const handleUnlikePost = async () => {
    

    await graphqlClient.request(unlikePostMutation, { postId: data.id });
    toggleLike()

  };
  

  
    
   
 
  const handleCommentClick = () => {
  
   setCommentBoxStatus(!commentBoxStatus)
  }
  
  const handleDeletePost = () => {
   mutate()
  }
  
   return (
    
    <div className="flex flex-nowrap card p-5 hover:bg-slate-900 transition-all cursor-pointer">
      
      <div className="grid grid-cols-12 gap-3">
        <div  className="col-span-1">
          {data.author?.profileImageURL && (
            <Image 
              className="rounded-full"
              src={data.author.profileImageURL}
              alt="user-image"
              height={50}
              width={50}
            />
          )}
        </div>
        <div  className="col-span-11 ml-3">
         <div className="flex justify-between">
          <h5>
            <Link className="head text-2xl" href={`/${data.author?.id}`}>
              {data.author?.firstName} {data.author?.lastName}
            </Link>
          </h5>
          {user?.id == data.author?.id && <span onClick={handleDeletePost}><MdOutlineDeleteOutline className="text-3xl delete"/></span>}
          </div>
          <p className="post-text text-xl mt-4 mb-4">{data.content}</p>
        
          {data.imageURL && (
            <Image style={{borderRadius:"15px"}}  src={data.imageURL} alt="image" width={700} height={700} />
          )}
          <div className="grid gap-4 row-span-12 mt-5 text-xl p-2 w-[90%]">
            
            <div className="flex gap-10 items-center row-span-2 /">
            <span>
  {liked ? (
    <AiFillHeart className="w-9 h-9 text-red-500 row-span-1" onClick={handleUnlikePost} />
  ) : (
    <AiOutlineHeart className="w-9 h-9 row-span-1" onClick={handleLikePost} />
  )}
</span>
            
          
            <span>
            
            <GoComment className="w-8 h-8" onClick={handleCommentClick}/>
           
           
         
    
          
            
            </span>
            </div>
            
           <div className="row-span-2">
           {commentBoxStatus && <CommentBox
      commentValue={commentValue}
      handleCommentValue={handleCommentValue}
      enterCommentLine={enterCommentLine}
      submitCommentLine={submitCommentLine}
    />}
  
            </div> 
          
       <div><Comment commentLine={commentLine} postId={data.id}/>
        </div>   
          
          
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default FeedCard;
