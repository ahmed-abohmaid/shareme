import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../Client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

import './global.css';
import { toast } from 'react-toastify';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [feilds, setFeilds] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === 'image/png' ||
      type === 'image/svg' ||
      type === 'image/jpeg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);
      setDisabled(true);

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
          setDisabled(false);
          toast.success('Image Uploaded Successfully');
        })
        .catch(() => toast.error('Somthing Went Wrong, Please Try Again!'));
    } else {
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id, // we make this ref because image in somewhere in sanity and we need it in save-pin doc
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };

      client
        .create(doc)
        .then(() => {
          navigate('/');
          toast.success('Image Added Successfully');
        })
        .catch(() => toast.error('Somthing Went Wrong, Please Try Again!'));
    } else {
      setFeilds(true);

      setTimeout(() => {
        setFeilds(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {feilds && (
        <p className="text-red-500 relative mb-5 text-xl transition-all duration-150 ease-in animate-bounce temporary-bounce">
          Please fill in all the feilds.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white dark:bg-dark3_2 lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor dark:bg-dark3 p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 dark:border-darkBorder p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && (
              <p className="text-red-500 mb-8">Wrong image type</p>
            )}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center cursor-pointer">
                    <p className="text-2xl text-bold dark:text-white">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg dark:text-white">Click to upload</p>
                    <p className="mt-32 text-gray-400 dark:text-white text-center">
                      use high-quality JPG, SVG, PNG, GIF or TIFF less than 20
                      MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                  disabled={disabled}
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-img"
                  className="h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none opacity-75 hover:opacity-100 hover:shadow-md transition-all duration-500 ease-in-out"
                  title="delete"
                  onClick={() => {
                    setImageAsset(null);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="flex-1 outline-none border-2 rounded-md dark:bg-dark3 border-gray-200 dark:border-darkBorder/50 py-2 pl-3 transition-all duration-300 ease-linear focus:border-gray-300 dark:focus:border-darkBorder focus:rounded-2xl placeholder:focus:opacity-0 placeholder:focus:transition-opacity dark:placeholder:text-white dark:text-white"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white dark:bg-dark3_2 rounded-lg">
              <img
                src={user.image}
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold dark:text-white">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="what is your pin about ?"
            className="flex-1 outline-none border-2 rounded-md dark:bg-dark3 border-gray-200 dark:border-darkBorder/50 py-2 pl-3 transition-all duration-300 ease-linear focus:border-gray-300 dark:focus:border-darkBorder focus:rounded-2xl placeholder:focus:opacity-0 placeholder:focus:transition-opacity dark:placeholder:text-white dark:text-white"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="flex-1 outline-none border-2 rounded-md dark:bg-dark3 border-gray-200 dark:border-darkBorder/50 py-2 pl-3 transition-all duration-300 ease-linear focus:border-gray-300 dark:focus:border-darkBorder focus:rounded-2xl placeholder:focus:opacity-0 placeholder:focus:transition-opacity dark:placeholder:text-white dark:text-white"
          />
          <div className="flex flex-col">
            <div>
              <p className="font-semibold mb-2 text-lg sm:text-xl dark:text-white">
                Choose pin category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none focus:bg-darkBorder w-4/5 text-base dark:border-b-0 border-b-2 border-gray-200 dark:border-darkBorder/50 py-2 pl-2 rounded-md cursor-pointer transition-all duration-200 ease-linear hover:shadow-sm focus:shadow-sm"
              >
                <option value="other" className="bg-white outline-none">
                  Select Category
                </option>
                {categories.map((cat, index) => (
                  <option
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                    value={cat.name}
                    key={index + 1}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                onClick={savePin}
              >
                Save pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
