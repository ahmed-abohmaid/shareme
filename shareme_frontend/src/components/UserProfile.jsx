import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

import {
  userSavedPinsQuery,
  userQuery,
  userCreatedPinsQuery,
} from "../utils/data";
import { client } from "../Client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none transition-all duration-75 ease-in dark:text-white";
const notActiveBtnStyles =
  "bg-primary text-black font-bold p-2 rounded-full w-20 outline-none transition-all duration-75 ease-in dark:text-white";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setiPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("Created");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setiPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setiPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 flex justify-center items-center">
      <div className="flex flex-col pb-5 w-full h-full">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="banner-pic"
              className="w-full h-370 2xl:h-510 shadow-md object-cover"
            />
            <img
              src={user?.image}
              alt="user"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3 dark:text-white">
              {user?.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2" title="Logout">
              {userId === user?._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-white p-2 rounded-full cursor-pointer shadow-md outline-none"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiesPolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div>
            <div className="text-center mb-7">
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("Created");
                }}
                className={`${
                  activeBtn === "Created" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Created
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("Saved");
                }}
                className={`${
                  activeBtn === "Saved" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Saved
              </button>
            </div>
            {pins?.length > 0 ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            ) : (
              <div className="flex justify-center items-center font-bold w-full text-xl mt-2">
                No pins found!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
