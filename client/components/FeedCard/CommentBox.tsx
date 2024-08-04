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
  submitCommentLine,
}) => {
  const isCommentButtonDisabled = commentValue.trim() === "";

  return (
    <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-2">
      <input
        className="flex-grow bg-transparent p-2 text-sm placeholder-gray-500 focus:outline-none"
        onKeyPress={enterCommentLine}
        value={commentValue}
        onChange={handleCommentValue}
        type="text"
        placeholder="Add a comment..."
      />
      <button
        onClick={submitCommentLine}
        disabled={isCommentButtonDisabled}
        className={`p-2 transition-colors ${
          isCommentButtonDisabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:text-blue-600"
        }`}
        aria-label="Post comment"
      >
        <BsSend size={20} />
      </button>
    </div>
  );
};

export default CommentBox;
