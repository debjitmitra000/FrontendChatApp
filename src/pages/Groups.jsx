import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { IoPersonRemoveSharp, IoPersonAddSharp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { MdFlipCameraIos } from "react-icons/md";
import { TbHomeShare } from "react-icons/tb";
import { FaListUl } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import BG from "../assets/images/BG.webp";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
  useUpdateGroupImageMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useDispatch, useSelector } from "react-redux";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);
const ConfirmDeleteMemberDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteMemberDialog")
);
import { setIsAddMember } from "../redux/reducers/misc";
import {
  NewGroupLoader,
  NewGroupSkeletonLoader,
} from "../components/layout/Loader";

const Groups = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("group");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [confirmDeleteMemberDialog, setConfirmDeleteMemberDialog] =
    useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [members, setMembers] = useState([]);
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [renameGrp, isLoadingGrpName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeGrpMem, isLoadingRemoveMem] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [updateGrpImage, isLoadingGrpImage] = useAsyncMutation(
    useUpdateGroupImageMutation
  );

  const [deleteGrp, isLoadingDeleteGrp] = useAsyncMutation(
    useDeleteChatMutation
  );

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    if (chatId && groupDetails.data?.success && groupDetails.data?.chat) {
      const groupData = groupDetails.data.chat;
      setGroupName(groupData.name ? `${groupData.name}` : "Unnamed Group");
      setGroupNameUpdatedValue(
        groupData.name ? `${groupData.name}` : "Unnamed Group"
      );
      setGroupAvatar(groupData?.avatar.url || "");
      setMembers(groupData.members);

      return () => {
        setGroupName("");
        setGroupNameUpdatedValue("");
        setMembers([]);
        setIsEdit(false);
      };
    }
  }, [chatId, groupDetails.data, myGroups.data]);

  const handleAvatarUpload = async(event) => {
    const file = event.target.files[0];
    if (file) {
      await updateGrpImage("Updating group image...", {chatId,imageFile:file});
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const navigateBack = () => navigate("/");
  const handleMobile = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    renameGrp("Renaming group...", { chatId, name: groupNameUpdatedValue });
  };

  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGrp("Deleting group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (member) => {
    setSelectedMember(member);
    setConfirmDeleteMemberDialog(true);
  };

  const confirmRemoveMemberHandler = () => {
    if (selectedMember) {
      removeGrpMem("Removing member...", {
        chatId,
        userId: selectedMember._id,
      });
      setConfirmDeleteMemberDialog(false);
      setSelectedMember(null);
    }
  };

  const cancelRemoveMemberHandler = () => {
    setConfirmDeleteMemberDialog(false);
    setSelectedMember(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-[#6c77af] bg-opacity-80 p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">ChatApp</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={navigateBack}
            className="text-white hover:text-[#694ac7]"
          >
            <TbHomeShare className="h-7 w-7 transform scale-x-[-1]" />
          </button>
          <button onClick={handleMobile} className="text-white sm:hidden">
            {isMobileMenuOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <FaListUl className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {isMobileMenuOpen && (
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[#6c77af] overflow-y-auto">
            <GroupsList
              myGroups={myGroups?.data?.groups}
              chatId={chatId}
              onClose={handleMobileClose}
            />
          </div>
        )}

        <div className="hidden sm:block w-1/4 bg-[#6f84c7] overflow-y-auto">
          <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
        </div>

        <div
          className="flex-1 relative p-4"
          style={{
            backgroundColor: "#f7fafc",
            backgroundImage: `url(${BG})`,
            backgroundRepeat: "repeat",
          }}
        >
          {chatId ? (
            groupDetails.isLoading ? (
              <NewGroupLoader />
            ) : (
              <div className="flex items-center justify-center min-h-full h-full w-full absolute inset-0">
                <div className="bg-[#694ac7] w-full max-w-md p-6 rounded-lg shadow-lg">
                  {/* Avatar Section */}
                  <div className="mb-4 flex flex-col items-center">
                    <div className="relative inline-block">
                      <img
                        src={groupAvatar}
                        alt="Group Avatar"
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                      />
                      <button
                        onClick={triggerFileInput}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"
                        disabled={isLoadingGrpImage}
                      >
                        <MdFlipCameraIos className="text-[#694ac7] hover:text-[#533a9e]" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Group Name Section */}
                  <div className="mb-4">
                    {isEdit ? (
                      <div className="space-y-4">
                        <label className="block text-white mb-2">
                          Group Name
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            value={groupNameUpdatedValue}
                            onChange={(e) =>
                              setGroupNameUpdatedValue(e.target.value)
                            }
                            className="w-full border-2 rounded-lg px-3 py-2 bg-inherit focus:outline-none text-white"
                          />
                          <button
                            onClick={updateGroupName}
                            className="bg-[#6f84c7] text-white p-2 rounded-lg hover:bg-[#586aa6]"
                            disabled={isLoadingGrpName}
                          >
                            <HiCheck />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center space-x-4">
                        <h2 className="text-2xl font-bold text-white">
                          {groupName}
                        </h2>
                        <button
                          onClick={() => setIsEdit(true)}
                          className="text-white hover:text-gray-200"
                          disabled={isLoadingGrpName}
                        >
                          <TbEdit className="text-2xl" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 className="text-white font-medium mb-2">Members</h4>
                  <div className="max-h-48 overflow-y-auto border-2 p-2 rounded-md bg-[#8a93bf]">
                    {isLoadingRemoveMem ? (
                      <NewGroupSkeletonLoader />
                    ) : (
                      members.map((member) => (
                        <div
                          key={member._id}
                          className="flex justify-between items-center p-2 mb-1 cursor-pointer rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-9 h-9 rounded-full border-2 border-[#694ac7] shadow-xl"
                            />
                            <span className="text-white">{member.name}</span>
                          </div>
                          <button
                            onClick={() => removeMemberHandler(member)}
                            className="text-white hover:text-[#ea5f5f]"
                          >
                            <IoPersonRemoveSharp size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-6 flex justify-around">
                    <button
                      onClick={openConfirmDeleteHandler}
                      className="flex items-center px-4 py-2 text-white bg-[#f67878] rounded-lg hover:bg-[#ea5f5f]"
                      disabled={isLoadingDeleteGrp}
                    >
                      <RiDeleteBin6Fill />
                      <span className="pl-2">Delete Group</span>
                    </button>
                    <button
                      onClick={openAddMemberHandler}
                      className="flex items-center px-4 py-2 text-white bg-[#6f84c7] rounded-lg hover:bg-[#586aa6]"
                    >
                      <IoPersonAddSharp />
                      <span className="pl-2">Add Member</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-2xl font-semibold text-[#694ac7]">
                  Open a group to manage
                </p>
                <p className="text-[#6f84c7] mt-2">
                  Select a group from the sidebar to view its details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAddMember && (
        <Suspense fallback={<div>Loading...</div>}>
          <AddMemberDialog
            chatId={chatId}
            onClose={() => dispatch(setIsAddMember(false))}
          />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmDeleteDialog
            onConfirm={deleteHandler}
            onCancel={closeConfirmDeleteHandler}
          />
        </Suspense>
      )}
      {confirmDeleteMemberDialog && selectedMember && (
        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmDeleteMemberDialog
            member={selectedMember}
            onConfirm={confirmRemoveMemberHandler}
            onCancel={cancelRemoveMemberHandler}
          />
        </Suspense>
      )}
    </div>
  );
};

const GroupsList = ({ myGroups, chatId, onClose }) => {
  if (!myGroups || !Array.isArray(myGroups)) {
    return <p className="text-center text-white">No groups available</p>;
  }

  const validGroups = myGroups.filter(
    (group) => group && (group._id || group.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4"
    >
      {validGroups.length > 0 ? (
        validGroups.map((group, index) => (
          <GroupListItem
            key={group._id || group.id || `group-${index}-${Date.now()}`}
            group={{
              ...group,
              _id: group._id || group.id || `temp-id-${index}`,
              name: group.name || `Group ${index + 1}`,
              avatar: group.avatar || "https://res.cloudinary.com/dtfyx1fwv/image/upload/v1738852717/vedy7a7qfseuc038dgdj.png",
            }}
            chatId={chatId}
            onClose={onClose}
            index={index}
          />
        ))
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white"
        >
          No groups found
        </motion.p>
      )}
    </motion.div>
  );
};


const GroupListItem = ({ group, chatId, onClose, index = 0 }) => {
  const navigate = useNavigate();
  const isActive = group._id === chatId;
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (group._id) {
      navigate(`/groups?group=${group._id}`);
      if (onClose) onClose();
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index, duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        viewport={{ once: true }}
      >
        <div
          onClick={handleClick}
          className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer ${
            isActive ? "bg-[#6d78b0]" : "bg-[#8a93bf]"
          } hover:bg-[#7a86b0] transition-all duration-200`}
        >
          <div className="relative">
            <img
              src={group.avatar}
              alt={`${group.name} avatar`}
              className="w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-105"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40";
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleModal();
              }}
            />
          </div>
          <span className="text-white">{group.name}</span>
        </div>
      </motion.div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            className="w-80 h-80 bg-black rounded-lg p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={group.avatar}
              alt={group.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Groups;
