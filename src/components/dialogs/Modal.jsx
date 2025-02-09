import React from "react";
import { motion } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";
import { BiSolidDownload } from "react-icons/bi";

const Modal = ({ isOpen, onClose, children, downloadUrl }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        mode: "no-cors", // Important for cross-origin requests
      });

      // Handle different content type
      const blob = await response.blob();

      // Extract filename from URL
      const filename = downloadUrl.split("/").pop() || "download";

      // Create download link
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative bg-gray-900 rounded-xl p-4 w-[90%] max-w-4xl max-h-[90vh] overflow-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#f67878] hover:text-[#ea5f5f] z-10"
        >
          <IoCloseCircle size={32} />
        </button>
        {children}
        {downloadUrl && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-[#694ac7] hover:bg-[#533a9e] text-white px-4 py-2 rounded-lg"
            >
              <BiSolidDownload size={20} />
              Download
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
