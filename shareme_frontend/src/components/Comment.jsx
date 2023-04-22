import React from 'react';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Comment = ({ comment, deleteComment, delettingComment, user }) => {
  return (
    <div
      key={comment.comment}
      className="flex relative gap-2 mt-5 items-center border-b-gray-200 border-b-2 pb-3 bg-white rounded-lg"
    >
      <Link
        to={`/user-profile/${comment.postedBy?._id}`}
        className="flex gap-2 mt-5 items-center bg-white rounded-lg"
      >
        <img
          src={comment.postedBy?.image}
          alt="user-profile"
          className="w-10 h-10 rounded-full cursor-pointer"
        />
      </Link>
      <div className="flex flex-col">
        <p className="font-bold">{comment.postedBy?.userName}</p>
        <p>{comment.comment}</p>
      </div>
      {comment.postedBy?._id === user?._id && (
        <button
          type="button"
          onClick={() => {
            deleteComment(comment._key);
          }}
          className={`absolute right-2 bottom-2 bg-white text-xl text-dark ${
            delettingComment &&
            `opacity-75 hover:opacity-100 shadow-lg outline-none transition-all duration-75 ease-in cursor-pointer`
          }`}
        >
          {delettingComment ? 'deletting' : <MdDelete />}
        </button>
      )}
    </div>
  );
};

export default Comment;
