import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { urlFor } from "../Client";
import PinInfo from "./PinInfo";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="m-2 animate-slide-fwd">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-100 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user-post"
          src={urlFor(image).width(250).url()}
        />
        <PinInfo
          show="md:hidden"
          postedBy={postedBy}
          image={image}
          _id={_id}
          destination={destination}
          save={save}
        />
        {postHovered && (
          <PinInfo
            show=" "
            postedBy={postedBy}
            image={image}
            _id={_id}
            destination={destination}
            save={save}
          />
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
