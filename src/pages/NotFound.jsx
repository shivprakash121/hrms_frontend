import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {

  const goBack = () => {
    window.history.go(-1)
}

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-9xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        Page not found
      </h2>
      <p className="text-gray-500 mb-4">
        The page you are looking for doesn’t exist or another error occurred.
      </p>
      <p>
        <Link
          onClick={goBack}
          className="text-blue-500 hover:underline"
        >
          Go back
        </Link>
        , or head over to{" "}
        <a
          href="https://example.com"
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          example.com
        </a>{" "}
        to choose a new direction.
      </p>
    </div>
  );
};

export default NotFound;
