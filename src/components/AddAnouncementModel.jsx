import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postAnnouncementDataAction } from '../store/action/userDataAction';
import { X } from 'lucide-react';

function AddAnouncementModel({ isOpenAnnouncement, onClose }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        description: '',
        dateTime: '',
        location: '',
    });

    const [imageUpload, setImageUpload] = useState('');
    const [previewName, setPreviewName] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUpload(reader.result);
            setPreviewName(file.name);
        };
        reader.readAsDataURL(file);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            imageUrl: imageUpload,
        };

        dispatch(postAnnouncementDataAction(payload));
        onClose(); // close modal
    };

    if (!isOpenAnnouncement) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center overflow-auto">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xl mx-4 animate-fadeIn font-inter">
                <div className="flex justify-between items-center border-b px-2 py-4">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">📢 {formData.id ? 'Edit Announcement' : 'Add Announcement'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-5 text-gray-700 py-4">
                    {/* Title */}
                    <div>
                        <label className="block mb-1 font-semibold">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter announcement title"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="What's the announcement about?"
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Date Time */}
                    <div>
                        <label className="block mb-1 font-semibold">Date & Time</label>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block mb-1 font-semibold">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Optional location"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block mb-1 font-semibold">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-dashed border-gray-300 p-2 rounded-lg text-sm cursor-pointer"
                        />
                        {imageUpload && (
                            <div className="mt-2 flex items-center gap-3">
                                <img src={imageUpload} alt="preview" className="w-16 h-16 rounded border object-cover" />
                                <p className="text-sm text-gray-500">{previewName}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
                        >
                            Save Announcement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAnouncementModel;
