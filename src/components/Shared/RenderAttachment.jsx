import React, { useState } from "react";
import {
  IoDocumentText,
  IoImageSharp,
  IoMusicalNotes,
  IoPlayCircle,
  IoVideocam,
} from "react-icons/io5";
import { transformImage } from "../../libs/features";
import Modal from "../dialogs/Modal";
const TruncatedText = ({ text, className }) => {
  const truncateWithEllipsis = (str, maxLength = 30) => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
  };

  return (
    <span className={className}>
      {truncateWithEllipsis(text)}
    </span>
  );
};
const RenderAttachment = ({ file, url }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const renderModalContent = () => {
    switch (file) {
      case "video":
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <IoVideocam className="w-8 h-8 text-[#694ac7]" />
              <TruncatedText text={url.split("/").pop()} className="text-white overflow-hidden" />
            </div>
            <video
              src={url}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] mx-auto"
              controlsList="noplaybackrate nodownload nofullscreen"
            />
          </div>
        );
      case "image":
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <IoImageSharp className="w-8 h-8 text-[#694ac7]" />
              <TruncatedText text={url.split("/").pop()} className="text-white overflow-hidden" />
            </div>
            <img
              src={transformImage(url, 600)}
              alt="Attachment"
              className="max-w-full max-h-[60vh] mx-auto object-contain"
            />
          </div>
        );
      case "audio":
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <IoMusicalNotes className="w-8 h-8 text-[#694ac7]" />
              <TruncatedText text={url.split("/").pop()} className="text-white overflow-hidden" />
            </div>
            <audio
              src={url}
              controls
              autoPlay
              className="w-full"
              controlsList="noplaybackrate nodownload"
            />
          </div>
        );
      default:
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <IoDocumentText className="w-8 h-8 text-[#694ac7]" />
              <TruncatedText text={url.split("/").pop()} className="text-white overflow-hidden" />
            </div>
            <iframe
              src={url}
              className="w-full h-[60vh] border rounded"
              title="Document Preview"
            />
          </div>
        );
    }
  };
  //thumbnail
  const renderThumbnail = () => {
    switch (file) {
      case "video":
        return (
          <div
            className="relative w-52 h-36 rounded-lg shadow-md cursor-pointer group"
            onClick={openModal}
          >
            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
              <IoPlayCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <IoPlayCircle className="w-12 h-12 text-[#9234eb] drop-shadow-lg" />
            </div>
          </div>
        );
      case "image":
        return (
          <img
            src={transformImage(url, 200)}
            alt="Attachment"
            className="w-52 h-36 object-contain bg-gray-800 rounded-lg shadow-md cursor-pointer"
            onClick={openModal}
          />
        );
      case "audio":
        return (
          <div
            className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg w-48 cursor-pointer "
            onClick={openModal}
          >
            <div
              className="flex items-center text-white hover:text-[#9234eb] cursor-pointer"
              onClick={openModal}
            >
              <IoMusicalNotes className="w-8 h-8" />
              <TruncatedText 
                text={url.split("/").pop()}
                className="pl-4 text-sm text-gray-300 flex-1 overflow-hidden group-hover:text-inherit"
                />
            </div>
          </div>
        );
      default:
        return (
          <div
            className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg w-48 cursor-pointer "
            onClick={openModal}
          >
            <div
              className="flex items-center text-white hover:text-[#9234eb] cursor-pointer"
              onClick={openModal}
            >
              <IoDocumentText className="w-8 h-8" />
              <TruncatedText 
                text={url.split("/").pop()}
                className="pl-4 text-sm text-gray-300 flex-1 overflow-hidden group-hover:text-inherit"
                />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderThumbnail()}
      <Modal isOpen={isModalOpen} onClose={closeModal} downloadUrl={url}>
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default RenderAttachment;
