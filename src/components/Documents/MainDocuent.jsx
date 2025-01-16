import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import PrivateIssueDocuments from "./IssueDocuments";
import PublicDocument from "./PublicDocument";
import { getUserDataAction } from "../../store/action/userDataAction";
import { useDispatch } from "react-redux";

const MainDocument = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserDataAction());
  }, [dispatch])
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
          <div className="flex gap-4">
            {/* First Card */}
            <div className="p-6 bg-white rounded-lg shadow-md flex items-center justify-between" style={{width:'25%',height:'8rem'}}>
              <h2 className="text-2xl font-bold mb-2">Private Doc.</h2>
              <div className="flex items-center justify-between">
                <button
                  className="p-3 bg-black text-white rounded-full"
                  onClick={() => setSelectedComponent("private")}
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>

            {/* Second Card */}
            <div className="p-6 bg-black rounded-lg shadow-md text-white flex items-center justify-between" style={{width:'25%',height:'8rem'}}>
              <h2 className="text-2xl font-bold mb-2">Public Doc.</h2>
              <div className="flex items-center justify-between">
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
