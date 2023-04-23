import React from 'react';
import { client } from '../Client';
import { fetchUser } from '../utils/fetchUser';

import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import Download from './Download';
import SavePin from './SavePin';
import { toast } from 'react-toastify';

const PinInfo = ({ show, postedBy, image, _id, destination, save }) => {
  const user = fetchUser();

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => toast.success('Pin Was Deleted Successfully'))
      .catch(() => toast.error('Somthing Went Wrong, Please Try Again!'));
  };

  return (
    <div
      className={`${show} absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50`}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Download image={image} />
        </div>
        <SavePin save={save} _id={_id} />
      </div>
      <div className="flex justify-between items-center gap-2 w-full">
        {destination && (
          <a
            href={destination}
            target="_bkank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-full flex items-center gap-2 font-bold text-black p-2 px-4 opacity-70 hover:opacity-100 hover:shadow-md outline-none"
          >
            <BsFillArrowUpRightCircleFill />
            {destination?.length > 20
              ? destination?.slice(8, 20)
              : destination?.slice(8)}
          </a>
        )}
        {postedBy?._id === user?.googleId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deletePin(_id);
            }}
            type="button"
            className="bg-white opacity-70 hover:opacity-100 text-dark outline-none rounded-3xl p-2 font-bold text-base hover:shadow-md"
          >
            <AiTwotoneDelete title="delete" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PinInfo;
