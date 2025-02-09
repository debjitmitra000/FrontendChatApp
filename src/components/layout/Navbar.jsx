import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaListUl } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import {
  TbSearch,
  TbUsersPlus,
  TbUsers,
  TbBell,
  TbLogout,
  TbUserEdit 
} from "react-icons/tb";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import toast from "react-hot-toast";
import { server } from "../../constants/config";


const Navbar = ({ onSearchClick, onProfileClick, onNotificationsClick, onNewGroupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { notificationCount } = useSelector((state) => state.chat);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  const logoutHandler = async () => {
    try {
      const { data } = await axios.delete(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="relative flex justify-between items-center p-4 bg-[#6c77af] bg-opacity-80 shadow-md transition-colors duration-500">
      <h1 className="text-2xl text-white font-bold">ChatAPP</h1>

      <div className="hidden sm:flex space-x-8 items-center">
        <button
          onClick={onSearchClick}
          className="flex items-center space-x-2 hover:text-[#694ac7] text-white text-2xl"
        >
          <TbSearch />
        </button>
        <button
          onClick={onNewGroupClick}
          className="flex items-center space-x-2 hover:text-[#694ac7] text-white text-2xl"
        >
          <TbUsersPlus />
        </button>
        <button
          onClick={() => handleNavigation("/groups")}
          className="flex items-center space-x-2 hover:text-[#694ac7] text-white text-2xl"
        >
          <TbUsers />
        </button>
        <button
          onClick={onProfileClick}
          className="flex items-center space-x-2 hover:text-[#694ac7] text-white text-2xl"
        >
          <TbUserEdit />
        </button>
        <button
          onClick={onNotificationsClick}
          className="relative flex items-center hover:text-[#694ac7] text-white text-2xl"
        >
          <TbBell />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 translate-x-2 -translate-y-2 bg-[#694ac7] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
        <button
          onClick={logoutHandler}
          className="flex items-center space-x-2 hover:text-[#694ac7] text-white text-2xl"
        >
          <TbLogout />
        </button>
      </div>

      {/* Menu Button for xs */}
      <div className="sm:hidden">
        <button
          onClick={toggleMenu}
          className="focus:outline-none text-2xl text-white"
        >
          {isMenuOpen ? <></> : <FaListUl />}
        </button>
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#6c77af] text-gray-100 flex flex-col items-start p-6 space-y-6 sm:hidden transition-transform duration-300 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <button
          onClick={toggleMenu}
          className="self-end text-2xl text-white focus:outline-none"
        >
          <AiOutlineClose />
        </button>

        <button
          onClick={() => {
            onSearchClick();
            toggleMenu();
          }}
          className="flex items-center space-x-2 text-xl hover:text-[#694ac7]"
        >
          <TbSearch />
          <span className="text-lg">Search</span>
        </button>
        <button
          onClick={() => {
            onNewGroupClick();
            toggleMenu();
          }}
          className="flex items-center space-x-2 text-xl hover:text-[#694ac7]"
        >
          <TbUsersPlus />
          <span className="text-lg">New Group</span>
        </button>
        <button
          onClick={() => {
            handleNavigation("/groups");
            toggleMenu();
          }}
          className="flex items-center space-x-2 text-xl hover:text-[#694ac7]"
        >
          <TbUsers />
          <span className="text-lg">Manage Groups</span>
        </button>
        <button
          onClick={() => {
            onProfileClick();
            toggleMenu();
          }}
          className="flex items-center space-x-2 text-xl hover:text-[#694ac7]"
        >
          <TbUserEdit  />
          <span className="text-lg">Edit Profile</span>
        </button>
        <button
          onClick={() => {
            onNotificationsClick();
            toggleMenu();
          }}
          className="relative flex items-center space-x-2 hover:text-[#694ac7] text-white text-xl"
        >
          <div className="relative">
            <TbBell />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 translate-x-2 -translate-y-2 bg-[#694ac7]  text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>
          <span className="text-lg">Notifications</span>
        </button>
        <button
          onClick={() => {
            logoutHandler();
            toggleMenu();
          }}
          className="flex items-center space-x-2 text-xl hover:text-[#694ac7]"
        >
          <TbLogout />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
