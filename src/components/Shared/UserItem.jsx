import React from "react";
import { FaCircleUser } from "react-icons/fa6";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, id, avatar, username } = user;

  return (
    <li className={`flex items-center justify-between px-4 py-3 ${styling}`}>
      {/* Avatar and User Info */}
      <div className="flex items-center space-x-4">
        {avatar ? (
          <img
            src={avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover shadow-md"
          />
        ) : (
          <FaCircleUser className="w-10 h-10 text-[#6f84c7] bg-[#694ac7] rounded-full shadow-xl" />
        )}
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-400">@{username}</p>
        </div>
      </div>

      {/* Add/Remove Button */}
      <button
        className={`px-3 py-1 text-sm rounded-lg ${
          isAdded
            ? "bg-[#ea5f5f] hover:bg-[#ea5f5f]"
            : "bg-[#6f84c7] hover:bg-[#586aa6]"
        } text-white`}
        onClick={() => handler(id)}
        disabled={handlerIsLoading}
      >
        {isAdded ? "Cancel" : "Request"}
      </button>
    </li>
  );
};

export default React.memo(UserItem);
