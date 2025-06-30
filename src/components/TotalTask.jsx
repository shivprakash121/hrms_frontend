import React, { useEffect, useState } from "react";
import TaskRecords from "./TaskRecords";
import { useDispatch, useSelector } from "react-redux";
import { getTotalProjectAction, getUserDataAction } from "../store/action/userDataAction";

const TotalTask = () => {
  const [projectId, setProjectId] = useState(null); // Track selected project ID
  const [projectName, setProjectName] = useState('');
  const [show, setShow] = useState(false); // Show/Hide TaskRecords component
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDataAction());
  }, [dispatch]);

  // Fetch project data from Redux
  const { loading, data } = useSelector((state) => state.getTotalProjectList);
  const projectData = data?.data || []; // Fallback to an empty array if no data

  useEffect(() => {
    dispatch(getTotalProjectAction());
  }, [dispatch]);

  // Handle project selection and show TaskRecords
  const handleProjectSelection = ({ projectI, projectN }) => {
    setProjectId(projectI);
    setProjectName(projectN)
    setShow(true); // Show the TaskRecords component
  };

  return (
    <>
      {show ? (
        <TaskRecords onBack={() => setShow(false)} projectId={projectId} projectName={projectName} />
      ) : (
        <div className="p-6">
          {/* Page Header */}
          <h1 className="text-2xl font-semibold text-gray-800">All Projects</h1>
          {/* Project List */}
          {loading ? (
            <div className="flex flex-wrap gap-6 pt-6">
              <div className="text-xl text-gray-500">Loading...</div>
            </div>
          ) :
            (<div className="flex flex-wrap gap-6 pt-6">
              {projectData.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectSelection({ projectI: project.id, projectN: project.name })}
                  className="cursor-pointer flex flex-col items-center justify-center w-80 h-40 rounded-lg shadow-md bg-white text-gray-600 transition-all duration-200 hover:shadow-lg hover:bg-blue-500 hover:text-white"
                >
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  <p className="text-sm mt-2">{project.description}</p>
                  <p className="text-sm mt-2">Start: {project.date_start.split("T")[0]}</p>
                </div>
              ))}
            </div>)
          }
        </div>
      )}
    </>
  );
};

export default TotalTask;
