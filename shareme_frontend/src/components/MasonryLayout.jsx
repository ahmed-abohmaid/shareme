import React from "react";
import Masorny from "react-masonry-css";

import Pin from "./Pin";
import "./global.css";

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masorny className="flex animate-slide-fwd mt-5" breakpointCols={breakpointObj}>
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className="w-max" />
      ))}
    </Masorny>
  );
};

export default MasonryLayout;
