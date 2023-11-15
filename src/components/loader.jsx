import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center px-5 py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
    </div>
  );
};

export default Loader;
