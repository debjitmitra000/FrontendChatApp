import React, { useRef } from "react";
import toast from "react-hot-toast";
import { IoDocument } from "react-icons/io5";
import { MdImage, MdLibraryMusic, MdVideoLibrary } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setUploadingLoader } from "../../redux/reducers/misc";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorPosition, chatId, onClose }) => {
  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const dispatch = useDispatch();

  const [sendAttachments] = useSendAttachmentsMutation()

  const fileChangeHandler = async(e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) toast.error(`Max 5 ${key} can be send together`);
    dispatch(setUploadingLoader(true))
    const toastId = toast.loading(`Sending ${key}...`)
    onClose();
    try {
      const attachmentForm = new FormData();
      attachmentForm.append("chatId", chatId);
      files.forEach((file) => attachmentForm.append("files", file));

      const res = await sendAttachments(attachmentForm);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });

    } catch (error) {
      toast.error(error,{id:toastId})
    } finally {
      dispatch(setUploadingLoader(false))
    }
  };

  return (
    <div
      className="absolute bg-[#694ac7] shadow-lg rounded-md p-4"
      style={{
        top: anchorPosition.top - 220,
        left: anchorPosition.left,
        width: "150px",
      }}
    >
      <ul>
        <li
          className="flex items-center p-2 text-white hover:bg-[#503bba] cursor-pointer "
          onClick={() => imageRef.current.click()}
        >
          <MdImage className="mr-2" size={20} /> Image
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            style={{ display: "none" }}
            ref={imageRef}
            onChange={(e) => fileChangeHandler(e, "Images")}
          />
        </li>
        <li
          className="flex items-center p-2 text-white hover:bg-[#503bba] cursor-pointer "
          onClick={() => audioRef.current.click()}
        >
          <MdLibraryMusic className="mr-2" size={19} /> Audio
          <input
            type="file"
            multiple
            accept="audio/mpeg, audio/wav"
            style={{ display: "none" }}
            ref={audioRef}
            onChange={(e) => fileChangeHandler(e, "Audios")}
          />
        </li>
        <li
          className="flex items-center p-2 text-white hover:bg-[#503bba] cursor-pointer "
          onClick={() => videoRef.current.click()}
        >
          <MdVideoLibrary className="mr-2" size={19} /> Video
          <input
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            style={{ display: "none" }}
            ref={videoRef}
            onChange={(e) => fileChangeHandler(e, "Videos")}
          />
        </li>
        <li
          className="flex items-center p-2 text-white hover:bg-[#503bba] cursor-pointer "
          onClick={() => fileRef.current.click()}
        >
          <IoDocument className="mr-2" size={20} /> File
          <input
            type="file"
            multiple
            accept="*"
            style={{ display: "none" }}
            ref={fileRef}
            onChange={(e) => fileChangeHandler(e, "Files")}
          />
        </li>
      </ul>
    </div>
  );
};

export default FileMenu;
