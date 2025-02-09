import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";


const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Message"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/mychats",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    searchUser: builder.query({
      query: (user) => ({
        url: `user/searchuser/?user=${user}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendRequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `user/Notifications`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptRequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}/?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    myGroups: builder.query({
      query: () => ({
        url: "chat/groupsbyme",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/getFriends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chat/new",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    newGroup: builder.mutation({
      query: (data) => ({
        url: "chat/newgroup",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),

    removeGroupMember: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: "chat/removeMember",
        method: "DELETE",
        credentials: "include",
        body: { chatId, userId },
      }),
      invalidatesTags: ["Chat"],
    }),

    addGroupMember: builder.mutation({
      query: ({ members, chatId }) => ({
        url: "chat/addMembers",
        method: "PUT",
        credentials: "include",
        body: { members, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),

    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leaveGroup/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "user/updateProfile",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateGroupImage: builder.mutation({
      query: ({ chatId, imageFile }) => {
        const formData = new FormData();
        formData.append('avatar', imageFile);
        return {
          url: `chat/updateGrpImage/${chatId}`,
          method: "PUT",
          credentials: "include",
          body: formData,
        };
      },
      invalidatesTags: ["Chat"],
    }),

    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `chat/deletemessage/${messageId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Message"],
    }),

  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
  useMyGroupsQuery,
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMemberMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
  useUpdateProfileMutation,
  useUpdateGroupImageMutation,
  useDeleteMessageMutation
} = api;
