import React, { useState } from "react";
import { MdAddCircleOutline, MdAddTask } from "react-icons/md";
import { HiCheck, HiX } from "react-icons/hi";
import { validateGroupName, validateMembers } from "../../utils/GroupValidator";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { NewGroupSkeletonLoader } from "../layout/Loader";

const NewGroup = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({ groupName: "", members: "" });

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  const [newGroup, newGroupLoading] = useAsyncMutation(useNewGroupMutation);

  const errorr = [
    {
      isError,
      error,
    },
  ];
  useErrors(errorr);

  const selectMemberHandler = (userId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const submitHandler = async () => {
    const groupNameError = validateGroupName(groupName);
    const membersError = validateMembers(selectedMembers);

    if (groupNameError || membersError) {
      setErrors({ groupName: groupNameError, members: membersError });
      return;
    }

    newGroup("Creating New Group...", {
      name: groupName,
      members: selectedMembers,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-30">
      <div className="bg-[#694ac7] w-full max-w-md p-6 rounded-lg shadow-lg">
        <h3 className="text-center text-white text-xl font-bold mb-4">
          New Group
        </h3>

        {/* Group Name Input */}
        <div className="mb-4">
          <label className="block text-white mb-2">Group Name</label>
          <input
            type="text"
            className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none text-white bg-[#8a93bf] placeholder-[#f4f3f3dc]"
            value={groupName}
            placeholder="Enter group name..."
            onChange={(e) => {
              setGroupName(e.target.value);
              setErrors((prev) => ({ ...prev, groupName: "" }));
            }}
          />
          {errors.groupName && (
            <p className="text-[#f67878] text-sm mt-1">{errors.groupName}</p>
          )}
        </div>

        {/* Members Selection */}
        <h4 className="text-white font-medium mb-2">Members</h4>
        {/* Members Selection */}

        <div className="max-h-48 overflow-y-auto border-2 p-2 rounded-md bg-[#8a93bf]">
          {isLoading ? (
            <NewGroupSkeletonLoader />
          ) : data?.friends.length > 0 ? (
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
            <p className="text-white text-center">No members to add</p>
          )}
        </div>

        {errors.members && (
          <p className="text-[#f67878] text-sm mt-1">{errors.members}</p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-around">
          <button
            className="flex items-center px-4 py-2 text-white bg-[#f67878] rounded-lg hover:bg-[#ea5f5f]"
            onClick={onClose}
            disabled={newGroupLoading}
          >
            <HiX />
            <span className="pl-2">Cancel</span>
          </button>
          <button
            className="flex items-center px-4 py-2 text-white bg-[#6f84c7] rounded-lg hover:bg-[#586aa6]"
            onClick={submitHandler}
            disabled={newGroupLoading}
          >
            <HiCheck />
            <span className="pl-2">Create</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroup;
