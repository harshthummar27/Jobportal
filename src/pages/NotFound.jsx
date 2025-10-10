import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="max-w-lg text-center">
        {/* Animated 404 number */}
        <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800 animate-pulse">
          404
        </h1>

        {/* Message */}
        <p className="mt-4 text-lg md:text-2xl text-gray-600">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Optional explanation */}
        <p className="mt-2 text-sm md:text-base text-gray-500">
          It might have been moved, renamed, or never existed.
        </p>

        {/* Call to action */}
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          Go Back Home
        </a>

        {/* Subtle illustration or icon */}
        <div className="mt-10">
          <svg
            className="mx-auto w-48 h-48 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="32" r="30" strokeWidth="4" />
            <line x1="20" y1="20" x2="44" y2="44" strokeWidth="4" />
            <line x1="44" y1="20" x2="20" y2="44" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
