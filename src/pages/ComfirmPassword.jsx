import React, { useState } from "react";
import ddHealthcare from "../assets/Icon/ddHealthcare.png"
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
const ConfirmPassword = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                {/* Logo */}
                <div className="flex justify-start mb-6">
                    <div className="w-10 h-10 rounded-full flex items-start justify-center">
                        <img src={ddHealthcare} alt="" className='w-10 h-6' />
                    </div>
                </div>
                {/* Heading */}
                <h2 className="text-xl font-bold text-gray-900 text-start mb-4">
                    Enter your new password
                </h2>
                <p className="text-sm text-gray-600 text-start mb-6">
                    Your new password must be different to previous passwords.
                </p>
                {/* Password Input */}
                <form>
                    <div className="mb-4 relative">
                        <label htmlFor="new-password" className="sr-only">
                            Enter new password
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="new-password"
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-3 top-2.5 text-gray-500 focus:outline-none"
                        >
                            {passwordVisible ? (
                                <IoEyeOutline size={20}/>
                            ) : (
                                <IoEyeOffOutline size={20}/>
                            )}
                        </button>
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="confirm-password" className="sr-only">
                            Confirm new password
                        </label>
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirm-password"
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setConfirmPasswordVisible(!confirmPasswordVisible)
                            }
                            className="absolute right-3 top-2.5 text-gray-500 focus:outline-none"
                        >
                            {confirmPasswordVisible ? (
                                <IoEyeOutline size={20}/>
                            ) : (
                                <IoEyeOffOutline size={20}/>
                            )}
                        </button>
                    </div>
                    {/* Reset Password Button */}
                    <div className="flex flex-wrap gap-4">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Reset password
                    </button>
                    <Link
                    to={'/forget_password'}
                        type="submit"
                        className="w-full px-4 py-2 border-2 text-center text-blue-600 rounded-lg"
                    >
                        Back to email
                    </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfirmPassword;
