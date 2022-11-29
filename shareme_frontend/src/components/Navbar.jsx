import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="flex gap-2 md:gap-5 w-full mt-5">
        <div className="flex justify-start items-center w-full px-2 rounded-lg bg-white border-none outline-none focus-within:shadow-sm">
          <IoMdSearch fontSize={20} className="ml-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            onFocus={() => navigate("/search")}
            className="p-2 w-full bg-white outline-none"
          />
        </div>
        <div className="flex gap-3">
          <Link to={`user-profile/${user?._id}`} className="hidden md:block">
            <img src={user.image} alt="user" className="w-14 h-12 rounded-lg" />
          </Link>
          <Link
            to="create-pin"
            className="bg-black text-white w-12 h-12 flex justify-center items-center rounded-lg md:w-14 md:h-12"
          >
            <IoMdAdd />
          </Link>
        </div>
      </div>
    );
  }
};

export default Navbar;
