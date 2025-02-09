import React from "react";
import { useSelector } from "react-redux";
import { setIsHandleChatMenu } from "../../redux/reducers/misc";
import { MdVideoCall } from "react-icons/md";
import { BiSolidExit } from "react-icons/bi";
import { RiUserUnfollowFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";

const HandleChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();
  const { isHandleChatMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const isGroup = selectedDeleteChat?.groupChat;

  const closeHandler = () => {
    dispatch(setIsHandleChatMenu(false));
    if (deleteMenuAnchor.current) {
      deleteMenuAnchor.current = null;
    }
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving group...", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Removing friend...", selectedDeleteChat.chatId);
  };

  const handleCall = () => {
    console.log("Calling:", selectedDeleteChat.chatId);
    closeHandler();
  };

  React.useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData, navigate]);

  if (!isHandleChatMenu) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={closeHandler}
    >
      <div
        className={`bg-white rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out ${
          isHandleChatMenu ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{
          position: "absolute",
          top: deleteMenuAnchor.current?.getBoundingClientRect().bottom - 100 || 0,
          left: deleteMenuAnchor.current?.getBoundingClientRect().left + 200 || 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-44">
          {/* Call Option */}
          {/* <div
            className="p-2 cursor-pointer flex items-center space-x-2"
            onClick={handleCall}
          >
            <MdVideoCall size={22}/>
            <span>{isGroup ? "Group Call" : "Video Call"}</span>
          </div> */}

          {/* Leave Group or Delete Chat Option */}
          <div
            className="p-2 cursor-pointer flex items-center space-x-2 text-[#694ac7] hover:text-[#ea5f5f]"
            onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
          >
              {isGroup ? (
                <BiSolidExit size={18}/>
              ) : (
                <RiUserUnfollowFill size={20}/>
              )}
            <span>{isGroup ? "Leave Group" : "Unfriend"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleChatMenu;
