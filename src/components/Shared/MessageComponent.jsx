import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { fileFormat } from "../../libs/features";
import RenderAttachment from "./RenderAttachment";
import HandleMessageMenu from "../dialogs/HandleMessageMenu ";

const MessageComponent = ({ message, user, isAlertMessage, chatId }) => {
  const { sender = {}, content, attachments, createdAt } = message || {};
  const sameSender = sender?._id === user?._id;
  const isSystemMessage = sender?.name?.toLowerCase() === "system";
  const [menuAnchor, setMenuAnchor] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const timeAgo = formatDate(createdAt);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (isAlertMessage) return;
    
    setMenuAnchor({ x: e.clientX, y: e.clientY });
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const getMessageStyle = () => {
    if (isAlertMessage || isSystemMessage) {
      return "bg-[#5d5f69] text-white mx-auto w-fit";
    }
    return sameSender
      ? "bg-[#694ac7] text-white self-end"
      : "bg-[#6f84c7] text-white self-start";
  };

  const getAnimationProps = () => {
    if (isSystemMessage || isAlertMessage) {
      return {
        initial: { opacity: 0, y: -20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
      };
    }
    return {
      initial: { opacity: 0, x: sameSender ? "100%" : "-100%" },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.3, ease: "easeOut" },
    };
  };

  return (
    <>
      <motion.div
        {...getAnimationProps()}
        viewport={{ once: true }}
        className={`p-3 rounded-lg shadow-md max-w-[70%] ${getMessageStyle()}`}
        onContextMenu={handleContextMenu}
      >
        {isAlertMessage || isSystemMessage ? (
          <p className="text-center text-xs font-semibold">{content}</p>
        ) : (
          <>
            {!sameSender && (
              <p className="text-sm font-semibold mb-1">{sender.name}</p>
            )}
            {content && <p className="text-sm">{content}</p>}
            {attachments?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map((attachment, index) => {
                  const file = fileFormat(attachment.url);
                  return <RenderAttachment key={index} file={file} url={attachment.url} />;
                })}
              </div>
            )}
            <p className="text-xs text-opacity-70 mt-2 text-right">{timeAgo}</p>
          </>
        )}
      </motion.div>
      {menuAnchor && (
        <HandleMessageMenu
          position={menuAnchor}
          onClose={handleCloseMenu}
          isSender={sameSender}
          messageID={message._id}
        />
      )}
    </>
  );
};

export default memo(MessageComponent);
