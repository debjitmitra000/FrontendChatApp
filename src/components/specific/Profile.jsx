import React from "react";
import moment from "moment";
import { FaCircleUser } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { FiAtSign } from "react-icons/fi";
import { FaRegFaceGrin } from "react-icons/fa6";

import { ImInfo } from "react-icons/im";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col items-center bg-[#6f84c7] text-white p-6 rounded-lg w-full h-full">
      <div className="relative">
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt="User Avatar"
            className="w-44 h-44 rounded-full object-cover border-4 border-slate-100 shadow-md"
          />
        ) : (
          <FaCircleUser className="w-44 h-44 text-[#8a93bf] bg-[#694ac7] rounded-full border-4 border-slate-100 shadow-md" />
        )}
      </div>
      <div className="mt-4 text-center space-y-4 w-full">
        <ProfileCard
          heading="About"
          text={user?.about || "No about"}
          Icon={
            <ImInfo className="text-[#8a93bf] border-4 border-[#694ac7] rounded-full bg-[#694ac7]" />
          }
        />
        <ProfileCard
          heading="Username"
          text={user?.username || "No username"}
          Icon={
            <FiAtSign className="text-[#8a93bf] border-4 border-[#694ac7] rounded-full bg-[#694ac7]" />
          }
        />
        <ProfileCard
          heading="Name"
          text={user?.name || "No name"}
          Icon={
            <FaRegFaceGrin className="text-[#8a93bf] border-4 border-[#694ac7] rounded-full bg-[#694ac7]" />
          }
        />
        <ProfileCard
          heading="Joined"
          text={user?.createdAt ? moment(user?.createdAt).fromNow() : "Unknown"}
          Icon={
            <MdDateRange className="text-[#8a93bf] border-4 border-[#694ac7] rounded-full bg-[#694ac7]" />
          }
        />
      </div>
    </div>
  );
};

const ProfileCard = ({ text, Icon, heading, className }) => (
  <div
    className={`flex items-center gap-4 p-2 bg-[#8a93bf] rounded-lg w-full ${
      className || ""
    }`}
  >
    {Icon && <div className="text-2xl">{Icon}</div>}
    <div className="flex-1">
      <p className="text-base font-medium">{text}</p>
      <p className="text-sm text-gray-300">{heading}</p>
    </div>
  </div>
);

export default Profile;
