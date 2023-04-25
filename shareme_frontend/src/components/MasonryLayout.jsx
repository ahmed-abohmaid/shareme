import React, { Suspense, lazy } from 'react';
import Masorny from 'react-masonry-css';

import './global.css';
import { Avatar, Skeleton } from '@mui/material';
const Pin = lazy(() => import('./Pin'));

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
    <Masorny className="flex mt-5" breakpointCols={breakpointObj}>
      {pins?.map((pin) => (
        <Suspense
          fallback={
            <div className="m-2">
              <Skeleton
                variant="rectangular"
                height="300px"
                animation="wave"
                className="dark:bg-darkComment"
              />
              <div className="flex items-center gap-1 mt-2">
                <Skeleton
                  variant="circular"
                  animation="wave"
                  className="dark:bg-darkComment"
                >
                  <Avatar />
                </Skeleton>
                <Skeleton
                  width="90%"
                  animation="wave"
                  className="dark:bg-darkComment"
                ></Skeleton>
              </div>
            </div>
          }
          key={pin._id}
        >
          <Pin pin={pin} className="w-max" />
        </Suspense>
      ))}
    </Masorny>
  );
};

export default MasonryLayout;
