import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // To make a uniqe id for each post
import { fetchUser } from '../utils/fetchUser';
import { client } from '../Client';

const SavePin = ({ save, _id }) => {
  const user = fetchUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 1, [2,3,1] => [1].length = 1 => !1 = false -> !false = true
  // 4, [2,3,1] => [].length = 0 => !0 = true -> !true = false
  const alreadySaved = !!save?.filter(
    (post) => post.postedBy?._id === user?.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      setIsSaving(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: 'postedBy',
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          setIsSaved(true);
          setIsSaving(false);
        });
    }
  };

  return alreadySaved || isSaved ? (
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
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  );
};

export default SavePin;
