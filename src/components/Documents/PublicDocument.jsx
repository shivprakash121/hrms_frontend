import React, { useEffect } from "react";
import { FiDownload, FiMoreVertical } from "react-icons/fi";
import { IoChevronBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getEmoployeeDocumentsAction } from "../../store/action/userDataAction";

const PublicDocument = ({ onBack }) => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.employeeDocument);
  const publicDocuments = data?.data || [];

  useEffect(() => {
    dispatch(getEmoployeeDocumentsAction());
  }, [dispatch]);

  const renderDocumentPreview = (location, index) => {
    if (!location) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Preview Not Available
        </div>
      );
    }
    return (
      <iframe
        loading="lazy"
        src={`https://docs.google.com/gview?url=${location}&embedded=true`}
        className="object-cover h-36 w-full rounded"
        frameBorder="0"
        title={`Document Preview ${index}`}
      ></iframe>
    );
  };

  if (loading) {
    return <div className="p-6 text-center">Loading documents...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load documents. Please try again later.
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <IoChevronBackOutline size={25} />
          </button>
          <h1 className="text-2xl font-bold">Public Documents</h1>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-4 gap-6">
        {publicDocuments.map((doc, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white shadow-sm flex flex-col"
          >
            <div className="h-36 w-50 bg-gray-200 rounded mb-4">
              {renderDocumentPreview(doc?.location, index)}
            </div>
            <h2 className="font-bold text-sm mb-2">
              {doc?.documentName || "Untitled Document"}
            </h2>
            <p className="text-gray-500 text-xs mb-4">
              {doc?.description || "No description provided."}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {doc?.docType || "Unknown Type"} -{" "}
                {doc?.createdAt?.split("T")[0] || "Unknown Date"}
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={doc?.location || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 bg-blue-500 text-white text-sm rounded"
                >
                  <FiDownload className="mr-2" /> Download
                </a>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                  <FiMoreVertical />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicDocument;