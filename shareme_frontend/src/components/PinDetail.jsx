import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../Client';
import MasonryLayout from './MasonryLayout';
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data';
import Spinner from './Spinner';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { lazy, Suspense } from 'react';
import { Avatar, Skeleton } from '@mui/material';
import Download from './Download';
import SavePin from './SavePin';
import { ToastContainer, toast } from 'react-toastify';
import DeletePin from './DeletePin';
const Comment = lazy(() => import('./Comment'));

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
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
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: 'postedBy', _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setAddingComment(false);
          setComment('');
          toast.success('Comment Added Successfully');
        })
        .catch(() => toast.error('Somthing Went Wrong, Please Try Again!'));
    }
  };

  const deleteComment = (key) => {
    client
      .patch(pinId)
      .unset([`comments[_key=="${key}"]`])
      .commit()
      .then(() => {
        fetchPinDetails();
        toast.success('Comment Was Deleted Successfully');
      })
      .catch(() => toast.error('Somthing Went Wrong, Please Try Again!'));
  };

  useEffect(fetchPinDetails, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <>
      {/* For Toasting Message */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={localStorage.getItem('theme')}
      />
      <div
        className="flex flex-col xl:flex-row m-auto mt-5 bg-white dark:bg-dark2"
        style={{ maxWidth: '1500px', borderRadius: '32px' }}
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
            <div className="flex gap-2 items-center flex-1">
              <Download image={pinDetail?.image} />
              <SavePin save={pinDetail?.save} _id={pinDetail?._id} />
            </div>
            <div className="flex items-center gap-2">
              {pinDetail?.postedBy?._id ===
                JSON.parse(localStorage.getItem('user')).googleId && (
                <DeletePin _id={pinDetail?._id} />
              )}
              <a
                href={pinDetail?.destination}
                target="_blank"
                rel="noreferrer"
                className="flex justify-between gap-2 items-center opacity-90 hover:opacity-100 transition-all duration-75 ease-in dark:text-white"
              >
                <BsFillArrowUpRightCircleFill className="dark:text-white" />
                {pinDetail?.destination.length > 20
                  ? pinDetail?.destination.slice(8, 30)
                  : pinDetail?.destination.slice(8)}
              </a>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-4xl break-words mt-5 dark:text-white">
              {pinDetail?.title}
            </h1>
            <p className="mt-3 dark:text-white">{pinDetail?.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail?.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white dark:bg-dark2 rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail?.postedBy?.image}
              alt="user"
            />
            <p className="font-semibold capitalize dark:text-white">
              {pinDetail?.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 mb-1 text-2xl dark:text-white">Comments</h2>
          <div className=" bg-gray-50 dark:bg-dark3 p-3 pt-1 rounded-sm">
            {pinDetail?.comments ? (
              <div className="max-h-370 overflow-y-auto">
                {pinDetail?.comments?.map((comment) => (
                  <Suspense
                    fallback={
                      <div className="flex items-center gap-1">
                        <Skeleton
                          variant="circular"
                          className="dark:bg-darkComment"
                        >
                          <Avatar />
                        </Skeleton>
                        <Skeleton
                          width="100%"
                          height="70px"
                          className="dark:bg-darkComment"
                        ></Skeleton>
                      </div>
                    }
                    key={comment.comment}
                  >
                    <Comment
                      comment={comment}
                      deleteComment={deleteComment}
                      user={user}
                    />
                  </Suspense>
                ))}
              </div>
            ) : (
              <h3 className="dark:text-white">Add comment to display</h3>
            )}
          </div>

          <div className="flex flex-wrap mt-6 gap-3 items-center">
            <Link
              to={`/user-profile/${pinDetail?.postedBy?._id}`}
              className="flex items-center bg-white dark:bg-dark2 rounded-lg"
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
              onKeyUp={(e) => e.key === 'Enter' && addComment()}
              placeholder="Add a comment"
              className="flex-1 outline-none border-2 rounded-md dark:bg-dark3 border-darkBorder dark:border-darkBorder/50 py-2 pl-3 transition-all duration-300 ease-linear focus:border-darkBorder focus:rounded-2xl placeholder:focus:opacity-0 placeholder:focus:transition-opacity dark:placeholder:text-white dark:text-white"
            />
            <button
              type="button"
              onClick={addComment}
              className="bg-red-500 hover:bg-red-600 transition-colors ease-linear text-white rounded-full px-6 py-2 text-base font-semibold outline-none"
            >
              {addingComment ? 'Posting...' : 'Add'}
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-center font-bold text-2xl mt-8 mb-4 dark:text-white">
        More like this
      </h2>
      <>
        {pins?.length > 0 ? (
          <MasonryLayout pins={pins} />
        ) : (
          <h2 className="flex justify-center items-center text-xl dark:text-white">
            No pins found
          </h2>
        )}
      </>
    </>
  );
};

export default PinDetail;
