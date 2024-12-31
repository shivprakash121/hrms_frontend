import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { loading, data } = useSelector((state) => state.userData);
  const userDataList = data?.data;

  const SkeletonRow = () => (
    <div className="animate-pulse">
      <p className="h-4 bg-gray-300 rounded w-1/3 mb-2"></p>
      <p className="h-4 bg-gray-200 rounded w-2/3"></p>
    </div>
  );

  return (
    <div className="w-full p-4 sm:p-6">
      {/* Profile Header */}
      <div className="border-b border-gray-200 p-4 sm:p-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
          ) : (
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            {loading ? (
              <>
                <p className="h-6 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></p>
                <p className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></p>
              </>
            ) : (
              <>
                <h1 className="text-md sm:text-lg font-semibold text-gray-800">
                  {userDataList?.employeeName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {userDataList?.designation}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {userDataList?.residentialAddress}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <h2 className="text-sm sm:text-md font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="flex flex-wrap gap-4">
          {loading
            ? Array(9)
                .fill(0)
                .map((_, index) => <SkeletonRow key={index} />)
            : (
              <>
                {[
                  { label: "First Name", value: userDataList?.employeeName },
                  { label: "Email Address", value: userDataList?.email },
                  { label: "Phone", value: `+91 ${userDataList?.contactNo}` },
                  { label: "Father Name", value: userDataList?.fatherName },
                  { label: "Mother Name", value: userDataList?.motherName },
                  { label: "Gender", value: userDataList?.gender },
                  { label: "Blood Group", value: userDataList?.bloodGroup },
                  { label: "Designation", value: userDataList?.designation },
                  { label: "Employee Code", value: userDataList?.employeeId },
                ].map((item, index) => (
                  <div key={index} className="flex-1 min-w-[45%]">
                    <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                    <p className="text-sm sm:text-md text-gray-800">{item.value}</p>
                  </div>
                ))}
              </>
            )}
        </div>
      </div>

      {/* Address Section */}
      <div className="p-4 sm:p-6">
        <h2 className="text-sm sm:text-md font-semibold text-gray-800 mb-4">Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, index) => <SkeletonRow key={index} />)
          ) : (
            <>
              {[
                { label: "Country", value: "India" },
                { label: "City/State", value: "Noida Gautam Budh Nagar" },
                { label: "Postal Code", value: "201301" },
                { label: "Permanent Address", value: userDataList?.permanentAddress },
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                  <p className="text-sm sm:text-md text-gray-800">{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Qualification Section */}
      <div className="p-4 sm:p-6">
        <h2 className="text-sm sm:text-md font-semibold text-gray-800 mb-4">
          Qualification
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, index) => <SkeletonRow key={index} />)
          ) : (
            <>
              {[
                { label: "Graduation", value: userDataList?.qualifications },
                { label: "Employment Type", value: userDataList?.employmentType },
                { label: "Total Experience", value: userDataList?.overallExperience },
              ].map((item, index) => (
                <div key={index}>
                  <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                  <p className="text-sm sm:text-md text-gray-800">{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
