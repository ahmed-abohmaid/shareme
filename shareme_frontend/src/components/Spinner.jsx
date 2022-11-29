import React from "react";
import * as Loader from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="mt-8 mb-5">
        <Loader.Circles color="#00bfff" height={50} width={200} />
      </div>

      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
