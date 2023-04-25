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
      className="bg-white opacity-70 hover:opacity-100 text-dark outline-none rounded-3xl p-2 font-bold text-base hover:shadow-md"
    >
      <AiTwotoneDelete title="Delete" />
    </button>
  );
};

export default DeletePin;
