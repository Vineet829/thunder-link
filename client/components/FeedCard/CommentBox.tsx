import React from 'react';
import { BsSend } from "react-icons/bs";





interface CommentBoxProps {
    commentValue: string;
    handleCommentValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    enterCommentLine: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    submitCommentLine: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }

  
const CommentBox: React.FC<CommentBoxProps> = ({ 
  commentValue, 
  handleCommentValue, 
  enterCommentLine, 
  submitCommentLine 
}) => {
  const enableCommentButton = (): boolean => {
    return (commentValue ? false : true);
  };

  const changeCommentButtonStyle = (): string => {
    return commentValue ? "comments-button-enabled" : "comments-button-disabled";
  };

  return (
    <div className="comments-box">
      <form className='flex gap-8'>
      <input className= 'bg-blue-950'
        onKeyPress={enterCommentLine}
        value={commentValue}
        onChange={handleCommentValue}
        
        id="comments-input"
       
        type="text"
        placeholder="Add a comment..."
      />
      
        <button  onClick={submitCommentLine}
        
        
        
        id={changeCommentButtonStyle()}
        disabled={enableCommentButton()}>
        Post
        </button>
    </form>
    </div>
  );
};

export default CommentBox;

  