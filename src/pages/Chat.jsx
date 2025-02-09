import { useInfiniteScrollTop } from "6pp";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/Shared/MessageComponent";
import "../components/styles/scrolls.css";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  REFETCH_MESSAGES,
  START_TYPING,
  STOP_TYPING,
} from "../constants/event";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { setIsFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loader";

const SkeletonMessage = ({ alignRight }) => (
  <div
    className={`flex w-full ${
      alignRight ? "justify-end" : "justify-start"
    } mb-6`}
  >
    <div
      className={`h-12 bg-gray-400 rounded-lg animate-pulse ${
        alignRight ? "w-1/3" : "w-2/3"
      }`}
    ></div>
  </div>
);

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const isFirstBackClick = useRef(true);
  const dispatch = useDispatch();
  const { isFileMenu } = useSelector((state) => state.misc);
  const socket = getSocket();

  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      if (isFirstBackClick.current) {
        isFirstBackClick.current = false;
        navigate("/");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  useEffect(() => {
    if (!chatId) {
      navigate("/");
    }
  }, [chatId, navigate]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: messegesOldOnes, setData: setMessegesOldOnes } =
    useInfiniteScrollTop(
      containerRef,
      oldMessagesChunk.data?.totalpages,
      page,
      setPage,
      oldMessagesChunk.data?.messages
    );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  useErrors(errors);

  const handleFileOpen = () => {
    if (isFileMenu) {
      dispatch(setIsFileMenu(false));
    } else if (fileMenuRef.current) {
      const rect = fileMenuRef.current.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      };
      dispatch(setIsFileMenu(true));
      setFileMenuAnchor(position);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const members = chatDetails?.data?.chat?.members;
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback((data) => {
    socket.emit(NEW_MESSAGE, {
      chatId: data.chatId,
      members,
      message: data.message,
      isSystem: true,
    });
    setMessage("");
  }, []);

  const refetchMessages = useCallback(() => {
    setMessages([]); 
    setPage(1); 
    oldMessagesChunk.refetch(); 
  }, [oldMessagesChunk]);

  const refetchMessagesListener = useCallback(() => {
      refetchMessages();
    },[chatId, user._id, refetchMessages]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [REFETCH_MESSAGES]: refetchMessagesListener,
  };

  useSocketEvents(socket, eventHandler);

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    socket.emit(START_TYPING, { members, chatId });
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessegesOldOnes([]);
      setPage(1);
      setMessage("");
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);
  const allMessages = [
    ...messegesOldOnes.filter((msg) => msg.chat === chatId),
    ...messages,
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return chatDetails.isLoading ? (
    <div className="w-full h-full flex flex-col p-4">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <SkeletonMessage key={index} alignRight={index % 2 === 1} />
        ))}
    </div>
  ) : (
    <>
      <div className="flex flex-col h-full w-full">
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto w-full flex flex-col space-y-2 p-4 mb-2 chatlist-scrollbar"
          style={{ maxHeight: "calc(100vh - 10rem)" }}
        >
          {allMessages.map((message) => {
            const isAlertMessage = !message?.sender; // Check if it's a system alert (sender is null)

            return (
              <div
                key={message._id}
                className={`flex w-full ${
                  isAlertMessage
                    ? "justify-center"
                    : message.sender._id === user._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <MessageComponent
                  key={message._id}
                  message={message}
                  user={user}
                  isAlertMessage={isAlertMessage}
                  chatId={chatId}
                />
              </div>
            );
          })}

          {userTyping && <TypingLoader />}
          <div ref={bottomRef} />
        </div>

        <form
          className="w-full flex items-center pl-2 pr-2 bg-[#8a93bf] rounded-lg space-x-2"
          onSubmit={submitHandler}
        >
          {/* File Attachment Button */}
          <button
            type="button"
            onClick={handleFileOpen}
            className="flex-shrink-0 text-[#694ac7] hover:text-[#503bba] p-2"
            ref={fileMenuRef}
          >
            <GrAttachment size={20} />
          </button>

          {/* Input Box */}
          <input
            type="text"
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
            className="flex-grow border rounded-md pl-2 pr-2 focus:outline-none focus:ring-2 focus:ring-[#694ac7]"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="flex-shrink-0 p-2 rounded-full text-[#694ac7] hover:text-[#503bba]"
          >
            <IoIosSend size={24} />
          </button>
        </form>
      </div>

      {isFileMenu && fileMenuAnchor && (
        <FileMenu
          anchorPosition={fileMenuAnchor}
          chatId={chatId}
          onClose={closeFileMenu}
        />
      )}
    </>
  );
};

export default AppLayout()(Chat);
