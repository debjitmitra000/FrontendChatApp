import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/BG.webp";
import notFoundGif from "../assets/images/404.gif";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  return (
    <div
      className="h-screen flex flex-col justify-center items-center text-gray-800"
      style={{
        backgroundColor: "#f7fafc",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "repeat",
      }}
    >
      <img
        src={notFoundGif}
        alt="404 Not Found"
        className="mb-2"
        style={{
          width: "300px",
          filter: "drop-shadow(12px 12px 10px rgba(0, 0, 0, 0.8))",
        }}
      />

      <h1 className="text-4xl font-bold mb-4">You seem to be lost!</h1>
      <p className="text-lg font-bold mb-6">Let's guide you back home.</p>
      <button
        onClick={goHome}
        className="px-6 py-3 bg-[#8a93bf] hover:bg-[#6d78b0] text-white rounded-lg shadow-lg transition duration-300"
        style={{
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.7)",
        }}
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
