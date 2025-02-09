import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-full text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-2xl font-semibold text-[#694ac7]">
                  Open a chat to message
                </p>
                <p className="text-[#6f84c7] mt-2">
                  Make friends and start chatting
                </p>
              </div>
            </div>
  );
};

export default AppLayout()(Home);
