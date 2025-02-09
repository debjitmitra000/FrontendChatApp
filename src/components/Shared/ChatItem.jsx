import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";

const ChatItem = ({
  avatar,
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  lastMessage,
  timestamp,
  newMessageAlert,
  index = 0,
  handleChat,
  onChatSelect,
}) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index, duration: 0.3 }}
        viewport={{ once: true }}
      >
        <Link
          to={`/chat/${_id}`}
          onClick={onChatSelect}
          onContextMenu={(e) => {
            e.preventDefault();
            handleChat(e, _id, groupChat);
          }}
          className={`flex items-center gap-4 p-2 rounded-lg relative transition-transform transform ${
            sameSender
              ? "bg-[#6d78b0] text-white"
              : "bg-[#8a93bf] hover:bg-[#7a86b0]"
          }`}
        >
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer ${
                isOnline ? "ring-2 ring-[#694ac7]" : ""
              }`}
              onClick={toggleModal}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <span className="text-sm text-gray-700">N/A</span>
              )}
            </div>
            
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-[#111826] hover:text-slate-700 transition-colors truncate">
              {truncateText(name, 15)}
            </p>
          </div>

          {newMessageAlert?.count > 0 && (
            <div className="w-6 h-6 bg-[#694ac7] text-white text-xs flex items-center justify-center rounded-full">
              {newMessageAlert.count}
            </div>
          )}
        </Link>
      </motion.div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <div
            className="w-80 h-80 bg-black rounded-lg p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ChatItem);