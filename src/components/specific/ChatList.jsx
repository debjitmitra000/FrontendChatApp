import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatItem from "../Shared/ChatItem";
import { useSelector } from "react-redux";
import "../styles/scrolls.css";

const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleChat,
  user
}) => {
  const navigate = useNavigate();
  const { isSearchOpen } = useSelector((state) => state.misc);

  const handleChatSelect = (chatId) => {
    navigate(`/chat/${chatId}`, { replace: true });
  };

  const calculateMaxHeight = () => {
    return isSearchOpen ? "calc(100vh - 220px)" : "calc(100vh - 100px)";
  };

  const checkOnlineStatus = (members) => {
    if (!members?.length || !onlineUsers?.length) {
      return false;
    }

    const otherMembers = members.filter(member => member._id !== user._id);
    
    const isAnyMemberOnline = otherMembers.some(member => onlineUsers.includes(member._id));

    return isAnyMemberOnline;
  };

  
  return (
    <div
      className="w-full overflow-y-auto p-4 rounded-lg space-y-4 chatlist-scrollbar"
      style={{
        maxHeight: calculateMaxHeight(),
        overflowY: "auto",
      }}
    >
      {chats.map((data, index) => {
        const { id, avatar, name, groupChat, lastMessage, timestamp, members } = data;
        // console.log(`Chat ${id} members:`, members);

        const isOnline = checkOnlineStatus(members,groupChat);
        
        const newMessageAlert = newMessagesAlert.find(
          (alert) => alert.chatId === id
        );

        return (
          <ChatItem
            index={index}
            avatar={avatar}
            name={name}
            _id={id}
            key={id}
            lastMessage={lastMessage}
            timestamp={timestamp}
            isOnline={isOnline}
            groupChat={groupChat}
            sameSender={String(chatId) === String(id)}
            newMessageAlert={newMessageAlert}
            handleChat={handleChat}
            onChatSelect={() => handleChatSelect(id)}
          />
        );
      })}
    </div>
  );
};

export default ChatList;