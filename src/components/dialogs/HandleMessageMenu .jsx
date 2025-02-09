import React from "react";
import { MdDelete } from "react-icons/md";
import { useAsyncMutation } from "../../hooks/hook";
import { useDeleteMessageMutation } from "../../redux/api/api";

const HandleMessageMenu = ({ position, onClose, isSender, messageID }) => {
  const [deleteMessage, isdeleteMessage] = useAsyncMutation(
    useDeleteMessageMutation
  );

  if (!isSender || !position) return null;

  const handleDelete = async (messageID) => {
    try {
      await deleteMessage("Deleting Message...", messageID);
      onClose();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out"
        style={{
          position: "absolute",
          top: position.y+20 || 0,
          left: position.x - 140 || 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-44 py-1">
          <div
            className="px-4 py-2 cursor-pointer flex items-center space-x-3 text-[#694ac7] hover:text-[#ea5f5f]"
            onClick={() => handleDelete(messageID)}
          >
            <MdDelete size={20} />
            <span className="text-sm">Delete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleMessageMenu;
