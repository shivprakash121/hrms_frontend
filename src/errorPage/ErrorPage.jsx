import React from 'react';
import ParachuteIcon from '../../src/assets/Icon/noroute.jpg';

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
            <div className="mb-6">
                {/* Replace the src with the actual image path */}
                <img loading='lazy' src={ParachuteIcon} className="w-36 h-auto" alt="Parachute Icon" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Oh ho ! No internet connection
            </h1>
            <div>
                <p className="text-gray-600 text-sm text-start">
                    Try:
                </p>
                <p className="text-gray-600 text-sm text-start p-4">
                    Checking the network cables, modem and router
                    <br />
                    Reconnecting to Wi-Fi
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;
