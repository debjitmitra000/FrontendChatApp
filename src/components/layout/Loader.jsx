import React from "react";
import "../styles/loader.css";

export const LayoutLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-[100vh] bg-white text-gray-900">
      <div className="relative p-4 flex items-center justify-center bg-gray-300 animate-pulse">
        <div className="h-12 w-24 bg-gray-400 rounded-md"></div>
      </div>

      <div
        className="hidden sm:flex p-4 items-center justify-center lg:col-span-2 animate-pulse"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="h-12 w-48 bg-gray-200 rounded-md"></div>
      </div>
      <div className="hidden lg:flex p-4 items-center justify-center bg-gray-300 animate-pulse">
        <div className="h-12 w-24 bg-gray-400 rounded-md"></div>
      </div>
    </div>
  );
};

export const SearchLoader = () => {
  return (
    <div className="fixed top-[64px] left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-30" />
  );
};

export const TypingLoader = () => {
  return (
    <div className="typing-loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export const NewGroupLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-gray-300 w-full max-w-md p-6 rounded-lg shadow-lg">
        <div className="mb-4 animate-pulse">
          <div className="h-6 bg-gray-400 rounded w-full"></div>
        </div>
        <div className="max-h-48 overflow-y-auto animate-pulse">
          <div className="h-10 bg-gray-400 rounded mb-2"></div>
          <div className="h-10 bg-gray-400 rounded mb-2"></div>
          <div className="h-10 bg-gray-400 rounded mb-2"></div>
        </div>
        <div className="mt-6 flex justify-around">
          <div className="px-4 py-2 text-white bg-gray-400 rounded-lg"></div>
          <div className="px-4 py-2 text-white bg-gray-400 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const NewGroupSkeletonLoader = () => {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-2 rounded-md bg-gray-300 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-400"></div>
            <div className="bg-gray-400 h-4 w-24 rounded-md"></div>
          </div>
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export const NotificationsLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-gray-300 w-full max-w-lg p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-400"></div>
            <div className="flex-1 h-4 bg-gray-400 rounded"></div>
          </div>
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-400"></div>
            <div className="flex-1 h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
