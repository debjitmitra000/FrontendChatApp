import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isSearchOpen: false,
    isFileMenu: false,
    isProfile:false,
    isHandleChatMenu: false,
    uploadingLoader: false,
    selectedDeleteChat: {
        chatId: "",
        groupChat: false,
    },
};
const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload;
        },
        setIsAddMember: (state, action) => {
            state.isAddMember = action.payload;
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload;
        },
        setIsSearchOpen: (state, action) => {
            state.isSearchOpen = action.payload;
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;
        },
        setIsProfile: (state, action) => {
            state.isProfile = action.payload;
        },
        setIsHandleChatMenu: (state, action) => {
            state.isHandleChatMenu = action.payload;
        },
        setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload;
        },
        setSelectedDeleteChat: (state, action) => {
            state.selectedDeleteChat = action.payload;
        },
    },
});

export default miscSlice;
export const { 
    setIsNewGroup,
    setIsAddMember,
    setIsNotification,
    setIsSearchOpen,
    setIsFileMenu,
    setIsProfile,
    setIsHandleChatMenu,
    setUploadingLoader,
    setSelectedDeleteChat,
    
} = miscSlice.actions;
