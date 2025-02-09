import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import BG from "../../assets/images/BG.webp";
import { SearchLoader, NewGroupLoader, NotificationsLoader } from "./Loader";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import { useNavigate, useParams } from "react-router-dom";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsSearchOpen,setIsNotification, setIsHandleChatMenu, setSelectedDeleteChat, setIsProfile } from "../../redux/reducers/misc";
import { useSelector, useDispatch } from "react-redux";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHAT } from "../../constants/event";
import { incrementNotification, resetNotificationCount, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../libs/features";
import HandleChatMenu from "../dialogs/HandleChatMenu";
import axios from "axios";
import { userExists, userNotExists } from "../../redux/reducers/auth";
const Search = React.lazy(() => import("../specific/Search"));
const Notifications = React.lazy(() => import("../specific/Notifications"));
const NewGroup = React.lazy(() => import("../specific/NewGroup"));
const EditProfile = React.lazy(() => import("../dialogs/EditProfileDialog"));

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();
    const {isProfile,isSearchOpen,isNotification} = useSelector(state=>state.misc);
    const {user} = useSelector(state=>state.auth);
    const {newMessagesAlert} = useSelector(state=>state.chat);


    const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

    const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")

    const[onlineUsers,setOnlineUsers] = useState([])

    const socket = getSocket();

    const navigate = useNavigate();

    const params = useParams();
    const chatId = params.chatId;
    const selectedChatId = chatId;

    const handleChatMenuAnchor = useRef(null); // Add this ref

    useEffect(() => {
      getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
    }, [newMessagesAlert])
    

    const newMessageAlertListener = useCallback((data)=>{
      if(data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data))
    },[chatId])

    const newRequestListener = useCallback(()=>{
      dispatch(incrementNotification())
    },[dispatch])
    
    const onlineUsersListener = useCallback((data) => {
      const onlineUserIds = Array.isArray(data) ? data : [];
      setOnlineUsers(onlineUserIds);
    }, []);

    const reftechProfile = async () => {
      try {
          const { data } = await axios.get('/api/v1/user/profile', { withCredentials: true });
          dispatch(userExists(data.user));
      } catch (error) {
          console.error('Error fetching profile:', error);
      }
  };
    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    

    const eventHandler = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHAT]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener
    };
  
    useSocketEvents(socket,eventHandler)

    const toggleSearch = () => dispatch(setIsSearchOpen(!isSearchOpen));
    const toggleProfile = () => dispatch(setIsProfile(!isProfile));
    const toggleNotifications = () => {
      if(!isNotification) dispatch(resetNotificationCount())
      dispatch(setIsNotification(!isNotification));
    }
    const toggleNewGroup = () => setIsNewGroupOpen(!isNewGroupOpen);

    const handleChat = (event, _id, groupChat) => {
      dispatch(setIsHandleChatMenu(true));
      dispatch(setSelectedDeleteChat({ chatId: _id, groupChat }))
      handleChatMenuAnchor.current = event.currentTarget;
    };

     
    
    useErrors([{isError,error}])
    

    return (
      <div className="relative">
        <Navbar
          onSearchClick={toggleSearch}
          onNotificationsClick={toggleNotifications}
          onNewGroupClick={toggleNewGroup}
          onProfileClick={toggleProfile}
        />
        <HandleChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={handleChatMenuAnchor}
        />

        {isNewGroupOpen && (
          <Suspense fallback={<NewGroupLoader />}>
            <NewGroup onClose={() => setIsNewGroupOpen(false)} />
          </Suspense>
        )}
        {isProfile && (
          <Suspense fallback={<NewGroupLoader />}>
            <EditProfile onClose={toggleProfile} onrefetch={reftechProfile}/>
          </Suspense>
        )}

        {isNotification && (
          <Suspense fallback={<NotificationsLoader />}>
            <Notifications onClose={() => toggleNotifications()} />
          </Suspense>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-[calc(100vh-64px)] bg-white text-gray-900">
          {/* Section 1 - Chat List */}
          <div
            className={`relative p-4 flex flex-col gap-4 bg-[#6f84c7] 
              ${chatId ? "hidden sm:flex sm:w-full" : "flex sm:w-full"}`}
          >
            {isSearchOpen && (
              <Suspense fallback={<SearchLoader />}>
                <div className="w-full rounded-lg">
                  <Search />
                </div>
              </Suspense>
            )}

            <div className="flex-1 overflow-y-auto rounded-lg">
            {isLoading ? (
              <div className="p-4">
              <div className="animate-pulse flex flex-col gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-300 rounded-lg w-full"
                  ></div>
                ))}
              </div>
            </div>
            ): (

              <ChatList
                chats={data?.chats || []}
                onlineUsers={onlineUsers}
                newMessagesAlert={newMessagesAlert}
                chatId={chatId}
                handleChat={handleChat}
                user={user}
              />
              
            )}
            </div>
          </div>

          {/* Section 2 - Selected Chat */}
          <div
            className={`p-4 flex flex-col items-center justify-center lg:col-span-2 ${
              selectedChatId ? "flex" : "hidden sm:flex"
            }`}
            style={{
              backgroundColor: "#000",
              //#f7fafc
              backgroundImage: `url(${BG})`,
              backgroundRepeat: "repeat",
            }}
          >
            <WrappedComponent {...props}/>
          </div>

          {/* Section 3 - Profile */}
          <div className="hidden lg:flex p-4 items-center justify-center bg-[#6f84c7]">
            <Profile/>
          </div>
        </div>
      </div>
    );
  };
};

export default AppLayout;
