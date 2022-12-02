import React from "react";
import { client } from "../Client";
import { fetchUser } from "../utils/fetchUser";

import { MdDownloadForOffline } from "react-icons/md";
import { v4 as uuidv4 } from "uuid"; // To make a uniqe id for each post
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

const PinInfo = ({ show, postedBy, image, _id, destination, save }) => {
  const user = fetchUser();

  // 1, [2,3,1] => [1].length = 1 => !1 = false -> !false = true
  // 4, [2,3,1] => [1].length = 0 => !0 = true -> !false = false
  const alreadySaved = !!save?.filter(
    (post) => post.postedBy?._id === user?.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div
      className={`${show} absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50`}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <a
            href={`${image?.asset?.url}?dl=`}
            download
            onClick={(e) => e.stopPropagation()} // To don't make it go to /pin-detail as we made on img
            className="bg-white rounded-full w-9 h-9 flex justify-center items-center text-xl text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none"
          >
            <MdDownloadForOffline />
          </a>
        </div>
        {alreadySaved ? (
          <button
            type="button"
            className="bg-red-500 opacity-70 hover:opacity-100 text-white outline-none rounded-3xl px-4 py-1 font-bold text-base hover:shadow-md"
          >
            {save?.length} Saved
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              savePin(_id);
            }}
            type="button"
            className="bg-red-500 opacity-70 hover:opacity-100 text-white outline-none rounded-3xl px-4 py-1 font-bold text-base hover:shadow-md"
          >
            Save
          </button>
        )}
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
