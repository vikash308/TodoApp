import React from "react";



export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      {/* Optional message */}
      <p className="mt-4 text-gray-700 font-medium"></p>
    </div>
  );
}
