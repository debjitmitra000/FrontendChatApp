import React, { memo, useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { MdOutlineBlock } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";


const Notifications = ({ onClose }) => {
  const dispatch = useDispatch();

  const {isLoading,data,error,isError} = useGetNotificationsQuery()
  
  useErrors([{error,isError}])

  const [acceptFriendRequest] = useAcceptFriendRequestMutation()

  const handleFriendRequest = async(reqId, status) => {
    dispatch(setIsNotification(false))
    try {
      const res = await acceptFriendRequest({reqId, status})

      if (res.data?.success) {
        console.log("socket use")
        toast.success(res.data.message)      
      } else {
        toast.error(res.data?.error?.message || "Something went wrong")  
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }




    // const requestPayload = {
    //   reqId: requestId,
    //   status: status
    // };
    // console.log(`Handling request: ${JSON.stringify(requestPayload)}`);
    // setNotifications((prev) =>
    //   prev.filter((notification) => notification._id !== requestId)
    // );
    // if (data?.allreq.length <= 1) {
    //   onClose();
    // }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50">
      <div className="bg-[#694ac7] w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg text-white font-semibold">Notifications</h3>
          <button className="text-white hover:text-gray-800" onClick={onClose}>
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        ) : (
          <>
            {data?.allreq.length > 0 ? (
              data?.allreq?.map(({ sender, _id }) => (
                <NotificationItem
                  key={_id}
                  sender={sender}
                  _id={_id}
                  onAccept={() => handleFriendRequest(_id, "Accepted")}
                  onReject={() => handleFriendRequest(_id, "Rejected")}
                  onBlock={() => handleFriendRequest(_id, "Blocked")} 
                />
              ))
            ) : (
              <p className="text-center text-white">No notifications to show</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NotificationItem = memo(({ sender, _id, onAccept, onReject,onBlock }) => {
  const { name, avatar } = sender;

  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 shadow-xl"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg font-bold">?</span>
            </div>
          )}
        </div>
        <p className="text-sm text-white leading-tight">
          {`${name} sent you a friend request.`}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          className="px-2 py-1 text-sm font-semibold text-white bg-[#6f84c7] rounded-lg hover:bg-[#586aa6]"
          onClick={onAccept}
        >
          <HiCheck size={20} />
        </button>
        <button
          className="px-2 py-1 text-sm font-semibold text-white bg-[#f67878] rounded-lg hover:bg-[#ea5f5f]"
          onClick={onBlock}
        >
          <MdOutlineBlock size={20} />
        </button>
        <button
          className="px-2 py-1 text-sm font-semibold text-white bg-[#f67878] rounded-lg hover:bg-[#ea5f5f]"
          onClick={onReject}
        >
          <HiX size={20} />
        </button>
      </div>
    </div>
  );
});

export default Notifications;
