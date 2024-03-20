import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-950">
      <span className="material-symbols-outlined scale-[10] m-[10rem]">
        Error
      </span>
      <h1 className="text-4xl font-bold text-white mb-4">404 Not Found</h1>
      <p className="text-zinc-600">
        Oops! The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-white text-black px-6 py-3 hover:bg-gray-500"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Error404;
