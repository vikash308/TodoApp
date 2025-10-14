import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200 p-6">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 animate-fadeIn flex flex-col items-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-2xl font-bold text-purple-700 animate-pulse">
          Loading your awesome dashboard...
        </h2>
      </div>
    </div>
  );
};

export default Loading;
