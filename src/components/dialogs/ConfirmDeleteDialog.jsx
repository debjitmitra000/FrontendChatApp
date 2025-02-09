import React from "react";
import { HiX, HiCheck } from "react-icons/hi";

const ConfirmDeleteDialog = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-30">
      <div className="bg-[#694ac7] max-w-sm w-full p-6 rounded-lg shadow-lg">
        {/* Header */}
        <h2 className="text-center text-white text-xl font-bold mb-4">
          Confirm Delete
        </h2>

        {/* Message */}
        <p className="text-white text-center mb-6">
          Are you sure you want to delete this group?
        </p>

        {/* Buttons */}
        <div className="flex justify-around">
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-white bg-[#f67878] rounded-lg hover:bg-[#ea5f5f] transition"
          >
            <HiX />
            <span className="pl-2">No</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center px-4 py-2 text-white bg-[#6f84c7] rounded-lg hover:bg-[#586aa6] transition"
          >
            <HiCheck />
            <span className="pl-2">Yes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
