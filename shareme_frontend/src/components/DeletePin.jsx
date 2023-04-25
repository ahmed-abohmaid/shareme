import React from 'react';
import { client } from '../Client';
import { toast } from 'react-toastify';
import { AiTwotoneDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const DeletePin = ({ _id }) => {
  const navigate = useNavigate();

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        toast.success('Pin Was Deleted Successfully');
        navigate('/');
        if (window.location.href.slice(0, -1) === window.location.origin) {
          window.location.reload();
        }
      })
      .catch(() => toast.error('Somthing Went Wrong, Please Try Again!'));
  };
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        deletePin(_id);
      }}
      type="button"
      className="bg-white rounded-full w-9 h-9 flex justify-center items-center text-xl text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none"
    >
      <AiTwotoneDelete title="Delete" />
    </button>
  );
};

export default DeletePin;
