import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import logo from '../assets/logo.png';
import logoWhite from '../assets/logowhite.png';
import { categories } from '../utils/data';

const isNotActiveStyle =
  'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-100 ease capitalize dark:text-white';
const isActiveStyle =
  'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black dark:border-white transition-all duration-100 ease capitalize dark:text-white';

const SideBar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) {
      closeToggle(false);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-darkHome h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img
            src={localStorage.getItem('theme') === "dark" ? logoWhite : logo}
            alt="logo"
            className="w-full"
          />
        </Link>
        <div className="flex flex-col gap-5 mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
            end
          >
            <RiHomeFill className="dark:text-white" />
            Home
          </NavLink>
          <h3 className="px-3 mt-2 text-base 2xl:text-xl dark:text-white">
            Discover Categories
          </h3>
          {categories.map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                alt="category-img"
                className="w-8 h-8 rounded-full shadow-sm"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex items-center gap-2 p-2 bg-white dark:bg-dark2 rounded-lg shadow-md mx-3"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className="w-10 h-10 rounded-full"
            alt="user-profile"
          />
          <div className="flex items-center">
            <p className="dark:text-white">{user.userName}</p>
            <IoIosArrowForward className="dark:text-white" />
          </div>
        </Link>
      )}
    </div>
  );
};

export default SideBar;
