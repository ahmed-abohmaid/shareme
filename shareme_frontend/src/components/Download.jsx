import React from 'react';
import { MdDownloadForOffline } from 'react-icons/md';

const Download = ({ image }) => {
  return (
    <a
      href={`${image?.asset?.url}?dl=`}
      download
      onClick={(e) => e.stopPropagation()} // To don't make it go to /pin-detail as we made on img
      className="bg-white rounded-full w-9 h-9 flex justify-center items-center text-xl text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none"
      title="Download"
    >
      <MdDownloadForOffline />
    </a>
  );
};

export default Download;
