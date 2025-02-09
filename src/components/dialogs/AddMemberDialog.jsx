import React, { useState } from "react";
import { MdAddCircleOutline, MdAddTask } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiX } from "react-icons/hi";
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { NewGroupSkeletonLoader } from "../layout/Loader";

const AddMemberDialog = ({ chatId, onClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [addGrpMem, isLoadingAddMem] = useAsyncMutation(useAddGroupMemberMutation);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  useErrors([{ isError, error }]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    addGrpMem("Adding Members...", { members: selectedMembers, chatId });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-30">
      <div className="bg-[#694ac7] w-full max-w-md p-6 rounded-lg shadow-lg">
        <h3 className="text-center text-white text-xl font-bold mb-4">Add Member</h3>

        <h4 className="text-white font-medium mb-2">Select Members</h4>
        <div className="max-h-48 overflow-y-auto border-2 p-2 rounded-md bg-[#8a93bf]">
          {isLoading ? (
            <NewGroupSkeletonLoader />
          ) : data?.friends?.length > 0 ? (
            data.friends.map((user) => (
              <div
                key={user.id}
                className={`flex justify-between items-center p-2 mb-1 cursor-pointer rounded-md ${
                  selectedMembers.includes(user.id) ? "bg-white" : ""
                }`}
                onClick={() => selectMemberHandler(user.id)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border-2 border-[#694ac7] shadow-xl"
                  />
                  <span
                    className={`${
                      selectedMembers.includes(user.id)
                        ? "text-[#586aa6]"
                        : "text-white"
                    }`}
                  >
                    {user.name}
                  </span>
                </div>
                <span
                  className={`text-xl font-semibold ${
                    selectedMembers.includes(user.id)
                      ? "text-[#586aa6]"
                      : "text-white"
                  }`}
                >
                  {selectedMembers.includes(user.id) ? (
                    <MdAddTask />
                  ) : (
                    <MdAddCircleOutline />
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No friends available</p>
          )}
        </div>

        <div className="mt-6 flex justify-around">
          <button
            className="flex items-center px-4 py-2 text-white bg-[#f67878] rounded-lg hover:bg-[#ea5f5f]"
            onClick={onClose}
            disabled={isLoadingAddMem}
          >
            <HiX />
            <span className="pl-2">Cancel</span>
          </button>
          <button
            className={`flex items-center px-4 py-2 text-white rounded-lg ${
              selectedMembers.length > 0 && !isLoadingAddMem
                ? "bg-[#6f84c7] hover:bg-[#586aa6]"
                : "bg-[#8a93bf] cursor-not-allowed"
            }`}
            onClick={submitHandler}
            disabled={selectedMembers.length === 0 || isLoadingAddMem}
          >
            {isLoadingAddMem ? (
              "Adding..."
            ) : (
              <>
                <IoPersonAddSharp />
                <span className="pl-2">Add Member</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDialog;
