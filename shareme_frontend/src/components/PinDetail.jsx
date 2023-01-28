import React, { useState, useEffect } from "react";
import { MdDelete, MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../Client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailQuery, pinDetailMorePinQuery } from "../utils/data";
import Spinner from "./Spinner";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams(); // we have passed a pinID as a variable in the url and use oarams deal with it ant fetch it

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client
        .fetch(`${query}`)
        .then((data) => {
          setPinDetail(data[0]);
          if (data[0]) {
            const query1 = pinDetailMorePinQuery(data[0]);

            client.fetch(`${query1}`).then((res) => setPins(res));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user?._id },
          },
        ])
        .commit()
        .then(() => {
          setTimeout(() => fetchPinDetails(), 1000);
          setTimeout(() => setAddingComment(false), 5000);
          setComment("");
        });
    }
  };

  const deleteComment = (key) => {
    client
      .patch(pinId)
      .unset([`comments[_key=="${key}"]`])
      .commit()
      .then(() => {
        setTimeout(() => fetchPinDetails(), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(fetchPinDetails, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <>
      <div
        className="flex flex-col xl:flex-row m-auto mt-5 bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            alt="user-post"
            className="rounded-t-2xl rounded-b-lg"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-full w-9 h-9 flex justify-center items-center text-xl text-dark opacity-75 hover:opacity-100 shadow-lg outline-none transition-all duration-75 ease-in"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetail?.destination}
              target="_blank"
              rel="noreferrer"
              className="flex justify-between gap-2 items-center opacity-90 hover:opacity-100 transition-all duration-75 ease-in"
            >
              <BsFillArrowUpRightCircleFill />
              {pinDetail?.destination.length > 20
                ? pinDetail?.destination.slice(8, 30)
                : pinDetail?.destination.slice(8)}
            </a>
          </div>
          <div>
            <h1 className="font-bold text-4xl break-words mt-5">
              {pinDetail?.title}
            </h1>
            <p className="mt-3">{pinDetail?.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail?.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail?.postedBy?.image}
              alt="user"
            />
            <p className="font-semibold capitalize">
              {pinDetail?.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment) => (
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
                    className="absolute right-2 bottom-2 bg-white text-xl text-dark opacity-75 hover:opacity-100 shadow-lg outline-none transition-all duration-75 ease-in cursor-pointer"
                  >
                    <MdDelete />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3 items-center">
            <Link
              to={`/user-profile/${pinDetail?.postedBy?._id}`}
              className="flex items-center bg-white rounded-lg"
            >
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={pinDetail?.postedBy?.image}
                alt="user"
              />
            </Link>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="flex-1 outline-none border-2 rounded-md border-gray-200 border-transparent py-2 pl-3 transition-all duration-300 ease-linear focus:border-gray-300 focus:rounded-2xl placeholder:focus:opacity-0 placeholder:focus:transition-opacity"
            />
            <button
              type="button"
              onClick={addComment}
              className="bg-red-500 hover:bg-red-600 transition-colors ease-linear text-white rounded-full px-6 py-2 text-base font-semibold outline-none"
            >
              {addingComment ? "Posting..." : "Add"}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  );
};

export default PinDetail;
