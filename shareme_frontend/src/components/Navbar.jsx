import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSetTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    window.location.reload();
  };

  if (user) {
    return (
      <div className="flex gap-2 md:gap-3 w-full mt-5 dark:bg-dark3_2">
        <div className="flex justify-start items-center w-[80%] px-2 rounded-lg bg-white dark:bg-dark3_2 border-darkBorder border-[1px] outline-none focus-within:shadow-sm">
          <IoMdSearch fontSize={20} className="ml-1 dark:text-white" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            onFocus={() => navigate('/search')}
            className="p-2 w-full bg-white dark:bg-dark2 outline-none dark:text-white dark:placeholder:text-white"
          />
        </div>
        <div className="flex gap-3">
          <Link to={`user-profile/${user?._id}`} className="hidden md:block">
            <img src={user.image} alt="user" className="w-14 h-12 rounded-lg" />
          </Link>
          <Link
            to="create-pin"
            className="bg-black border-2 dark:border-[1px] border-darkBorder dark:bg-gray-50 text-white dark:text-black w-12 h-12 flex justify-center items-center rounded-lg md:w-14 md:h-12"
          >
            <IoMdAdd />
          </Link>
        </div>
        <div className="flex-end flex items-center justify-between w-auto">
          <div className="dark:text-white font-bold mr-1 sm:mr-3 text-2xl">
            {theme !== 'light' ? <MdLightMode /> : <MdDarkMode />}
          </div>
          <label className="switch">
            <input type="checkbox" onClick={handleSetTheme} />
            <span className="slider dark:before:bg-gray-800 dark:bg-gradient-to-tr dark:from-inputR dark:to-inputL dark:before:translate-x-input"></span>
          </label>
        </div>
      </div>
    );
  }
};

export default Navbar;
