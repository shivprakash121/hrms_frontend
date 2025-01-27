import React, { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { changeTaskStatusAction, getTaskByProjectIdAction } from "../store/action/userDataAction";
import SingleTaskScren from "./SingleTaskScren";

const TaskRecords = ({ onBack, projectId, projectName }) => {
  const dispatch = useDispatch();
  const { loading, data: taskData } = useSelector((state) => state.getprojectbyid);
  const taskDataById = taskData?.data;

  const { data } = useSelector((state) => state.userData);
  const userDataList = data?.data || [];

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(getTaskByProjectIdAction(projectId));
  }, [dispatch, projectId]);

  const openModal = (id) => {
    setSelectedTask(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };
  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-50 flex"
          onClick={closeModal}
        >
          <div
            className="bg-white shadow-lg w-full max-w-2xl h-full overflow-y-auto fixed right-0 z-60"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <SingleTaskScren task={selectedTask} onClose={closeModal} />
          </div>
        </div>
      )}
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center text-center">
            <button onClick={onBack}>
              <IoChevronBackOutline size={25} />
            </button>
            <h1 className="text-2xl font-bold">{projectName}</h1>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-gray-500">Loading...</div>
          </div>
        ) :
          (<div className="flex gap-6 overflow-x-auto">
            {taskDataById?.map((column) => (
              column.items.length > 0 && ( // Only render if there are items
                <div key={column.status} className="w-80 flex-shrink-0">
                  <h2 className="text-lg font-medium text-gray-700 mb-4">
                    {column.status}{" "}
                    <span className="text-sm text-gray-500">
                      ({column.items.length})
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {column?.items?.map((task, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white shadow-md rounded-lg border border-gray-200 cursor-pointer hover:bg-sky-50"
                        onClick={() => openModal(task.id)}
                      >
                        <div className="flex justify-between ">
                          <span
                            className="inline-block text-xs font-medium px-2 py-1 rounded bg-pink-100 text-pink-700"
                          >
                            {task.deadline_date.split(" ")[0]}
                          </span>
                          {userDataList?.role === 'Manager' ?
                            <select
                              onChange={(e) => {
                                const id = task.id;
                                const stage_name = e.target.value;
                                dispatch(changeTaskStatusAction(id, stage_name));
                              }}
                            >
                              <option>{column.status}</option>
                              {column.status === 'Created' ? <>
                                <option value="Hold">Hold</option>
                              </>
                                :
                                column.status === 'In Progress' ?
                                  <>
                                    <option value="Hold">Hold</option>
                                  </>
                                  :
                                  column.status === 'Redo' ?
                                    <>
                                      <option value="Hold">Hold</option>
                                      <option value="Completed">Completed</option>
                                    </>
                                    :
                                    column.status === 'Running Late' ?
                                      <>
                                        <option value="Hold">Hold</option>
                                        <option value="Completed">Completed</option>
                                      </>
                                      :
                                      column.status === 'Review' ?
                                        <>
                                          <option value="Redo">Redo</option>
                                          <option value="Completed">Completed</option>
                                        </>
                                        :
                                        column.status === 'Completed' ?
                                          <>
                                            <option value="Hold">Hold</option>
                                          </>
                                          :
                                          column.status === 'Hold' ?
                                            <>
                                              <option value="Cancel">Cancel</option>
                                            </>
                                            :
                                            <option value="Hold">Hold</option>
                              }
                            </select>
                            :
                            <select
                              onChange={(e) => {
                                const id = task.id;
                                const stage_name = e.target.value;
                                dispatch(changeTaskStatusAction(id, stage_name));
                              }}
                            >
                              <option>{column.status}</option>
                              {column.status === 'Created' ? <>
                                <option value="In Progress">Start Task</option>
                              </>
                                :
                                column.status === 'In Progress' ?
                                  <>
                                    <option value="Review">Send Review</option>
                                  </>
                                  :
                                  column.status === 'Redo' ?
                                    <>
                                      <option value="Created">Start Task</option>
                                    </>
                                    :
                                    column.status === 'Running Late' ?
                                      <>
                                        <option value="Created">Start Task</option>
                                        <option value="Review">Send Review</option>
                                      </>
                                      :
                                      column.status === 'Cancel' ?
                                        <>
                                          <option value="Created">Start Task</option>
                                        </>
                                        :
                                        column.status === 'Hold' ?
                                          <>
                                            <option value="Created">Start Task</option>
                                            <option value="Cancel">Cancel</option>
                                          </>
                                          :
                                          column.status === 'Review' ? '' : ''
                              }
                            </select>}

                        </div>
                        <h3 className="text-sm font-medium text-gray-800 mt-2 ">
                          {task.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.task_description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex -space-x-2">
                            {task?.assignees_emails?.map((avatar, idx) => {
                              const nameParts = avatar.name.split(" ");
                              const initials =
                                nameParts[0]?.charAt(0) + (nameParts[1]?.charAt(0) || "");

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-blue-500 text-white font-bold"
                                >
                                  {initials.toUpperCase()}
                                </div>
                              );
                            })}
                          </div>
                          <span
                            className={`text-xs font-medium ${task.priority[0] === "Low"
                              ? "text-green-500"
                              : task.priority[0] === "Medium"
                                ? "text-yellow-500"
                                : "text-red-500"
                              }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                          <span>{task.comments} Comments</span>
                          <span>{task.links} Links</span>
                          <span>{task.subtasks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          )}
      </div>
    </>
  );
};

export default TaskRecords;