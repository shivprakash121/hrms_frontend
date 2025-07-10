import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import PrivateIssueDocuments from "./IssueDocuments";
import PublicDocument from "./PublicDocument";
import { getUserDataAction, postUploadEmployeeDocumentsAction } from "../../store/action/userDataAction";
import { useDispatch, useSelector } from "react-redux";
import { IoAdd } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";

const MainDocument = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    docType: "Public",
    documentName: "",
    employeeId: "",
    location: null, // location will hold the file
  });
  const { data } = useSelector((state) => state.userData);
  const userType = data?.data?.role;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDataAction());
  }, [dispatch]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      // Handle file input (assign the file to location)
      setFormData((prev) => ({ ...prev, location: files[0] })); // Set the first selected file
    } else {
      // Handle other form inputs (text fields)
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that location (the file) is available before proceeding
    if (!formData.location) {
      toast.error("Please select a document to upload.");
      return;
    }

    // Create a new FormData object to handle the file upload
    const fileData = new FormData();

    // Append the form data
    fileData.append("docType", formData.docType);
    fileData.append("documentName", formData.documentName);
    fileData.append("employeeId", formData.employeeId);

    // Append the selected file under the 'file' field
    fileData.append("file", formData.location); // Here, 'location' contains the file

    // Log the FormData object to the console for debugging
    for (let pair of fileData.entries()) {
      console.log(pair[0], pair[1]); // Log each field and value (including file)
    }

    // Dispatch the action with the FormData
    dispatch(postUploadEmployeeDocumentsAction(fileData));

    // Close the modal after submission
    handleCloseModal();
  };

  return (
    <div className="p-6">
      <ToastContainer />
      {selectedComponent === "private" && (
        <PrivateIssueDocuments onBack={() => setSelectedComponent(null)} />
      )}
      {selectedComponent === "public" && (
        <PublicDocument onBack={() => setSelectedComponent(null)} />
      )}

      {!selectedComponent && (
        <>
          <h1 className="text-3xl font-bold mb-6">Featured Documents</h1>
          <div className="flex gap-8">
            {userType === "HR-Admin" ? (
              <div className="p-6 bg-blue-500 rounded-lg shadow-lg flex items-center justify-between w-1/4 h-32 transition-transform transform hover:scale-105 cursor-pointer">
                <h2 className="text-2xl font-bold text-white">Add Doc.</h2>
                <button
                  className="p-3 bg-white rounded-full"
                  onClick={handleOpenModal}
                >
                  <IoAdd color="blue" size={30} />
                </button>
              </div>
            ) : (
              ""
            )}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center justify-between w-1/4 h-32 transition-transform transform hover:scale-105 cursor-pointer">
              <h2 className="text-2xl font-bold">Private Doc.</h2>
              <button
                className="p-3 bg-black text-white rounded-full"
                onClick={() => setSelectedComponent("private")}
              >
                <FiArrowRight size={20} />
              </button>
            </div>

            <div className="p-6 bg-black text-white rounded-lg shadow-lg flex items-center justify-between w-1/4 h-32 transition-transform transform hover:scale-105 cursor-pointer">
              <h2 className="text-2xl font-bold">Public Doc.</h2>
              <button
                className="p-3 bg-white text-black rounded-full"
                onClick={() => setSelectedComponent("public")}
              >
                <FiArrowRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Document</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Document Type</label>
                <select
                  name="docType"
                  value={formData.docType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md mt-2"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Document Name</label>
                <input
                  type="text"
                  name="documentName"
                  value={formData.documentName}
                  onChange={handleChange}
                  placeholder="Document Name"
                  className="w-full p-3 border rounded-md mt-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Employee ID"
                  className="w-full p-3 border rounded-md mt-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Document</label>
                <input
                  type="file"
                  name="location"
                  onChange={handleChange} // Handle file selection
                  className="w-full p-3 border rounded-md mt-2"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDocument;
