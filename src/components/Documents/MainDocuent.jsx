import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import PrivateIssueDocuments from "./IssueDocuments";
import PublicDocument from "./PublicDocument";

const MainDocument = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <div className="p-6">
      {/* Conditional Rendering */}
      {selectedComponent === "private" && (
        <PrivateIssueDocuments onBack={() => setSelectedComponent(null)} />
      )}
      {selectedComponent === "public" && (
        <PublicDocument onBack={() => setSelectedComponent(null)} />
      )}

      {/* Main Content */}
      {!selectedComponent && (
        <>
          <h1 className="text-2xl font-bold mb-6">Featured Documents</h1>
          <div className="grid grid-cols-2 gap-6">
            {/* First Card */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">Private Doc.</h2>
              <p className="text-sm text-gray-800 mb-6">
                It contains your appraisal and promotion documents.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">2 yrs Exp.</p>
                  <p className="text-2xl font-bold">7.20%</p>
                </div>
                <button
                  className="p-3 bg-black text-white rounded-full"
                  onClick={() => setSelectedComponent("private")}
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>

            {/* Second Card */}
            <div className="p-6 bg-black rounded-lg shadow-md text-white">
              <h2 className="text-2xl font-bold mb-2">Public Doc.</h2>
              <p className="text-sm text-gray-400 mb-6">
                It contains your qualification and certificate documents.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">2 yrs Exp.</p>
                  <p className="text-2xl font-bold">14.20%</p>
                </div>
                <button
                  className="p-3 bg-white text-black rounded-full"
                  onClick={() => setSelectedComponent("public")}
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainDocument;
