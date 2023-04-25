import React, { useState, useEffect, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Routes, Route } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { client } from '../Client';
import logo from '../assets/logo.png';
import logoWhite from '../assets/logowhite.png';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-dark3 h-screen flex-col md:flex-row transition-height duration-75 ease-out">
      <div className="hidden md:flex flex-initial h-screen">
        <Sidebar user={user && user} closeToggle={setToggleSidebar} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row shadow-md justify-between items-center">
          <HiMenu
            fontSize={40}
            className="cursor-pointer dark:text-white"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img
              src={localStorage.getItem('theme') === 'dark' ? logoWhite : logo}
              alt="logo"
              className="w-32"
            />
          </Link>
          <Link to={`/user-profile/${user?._id}`}>
            <img src={user?.image} alt="user" className="w-12 rounded-full" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-3/5 bg-white dark:bg-darkHome h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer dark:text-white"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
