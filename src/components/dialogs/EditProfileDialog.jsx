import React, { useRef, useState, useEffect } from 'react';
import { IoCameraReverse } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { useUpdateProfileMutation } from '../../redux/api/api';
import { useAsyncMutation } from '../../hooks/hook';
import { useSelector } from 'react-redux';

const EditProfileDialog = ({ onClose, onrefetch }) => {
    const {user} = useSelector(state=>state.auth);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        username: "",
        avatar: null
    });
    const [errors, setErrors] = useState({
        username: "",
        name: "",
        bio: "",
        avatar: ""
    });
    const fileInputRef = useRef(null);
    const [updateProfile, isLoading] = useAsyncMutation(useUpdateProfileMutation);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                bio: user.about || "",
                username: user.username || "",
                avatar: user.avatar?.url || null
            });
        }
    }, [user]);

    const handleClose = () => {
        setErrors({
            username: "",
            name: "",
            bio: "",
            avatar: ""
        });
        onClose();
    };

    const handleAvatarUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 5MB' }));
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatar: imageUrl }));
            setErrors(prev => ({ ...prev, avatar: "" }));
        }
    };

    const validateForm = () => {
        let newErrors = {
            username: "",
            name: "",
            bio: "",
            avatar: ""
        };
        let isValid = true;

        if (formData.username !== user.username) {
            if (formData.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters long';
                isValid = false;
            }
        }
    
        if (formData.name !== user.name) {
            if (formData.name.length < 2) {
                newErrors.name = 'Name must be at least 2 characters long';
                isValid = false;
            }
        }
    
        if (formData.bio !== user.about) {
            if (formData.bio.length > 150) {
                newErrors.bio = 'Bio must be less than 150 characters';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;

            const submitData = new FormData();
            
            if (formData.name !== user.name) submitData.append("name", formData.name);
            if (formData.bio !== user.about) submitData.append("about", formData.bio);
            if (formData.username !== user.username) submitData.append("username", formData.username);
            
            if (fileInputRef.current?.files[0]) {
                submitData.append("avatar", fileInputRef.current.files[0]);
            }

            if ([...submitData.entries()].length === 0) {
                handleClose();
                return;
            }

            await updateProfile("Updating profile...", submitData);
            handleClose();
            onrefetch();
            
        } catch (error) {
            const errorMessage = error.data?.message;
            if (errorMessage?.includes('username')) {
                setErrors(prev => ({ ...prev, username: errorMessage }));
            } else if (errorMessage?.includes('avatar')) {
                setErrors(prev => ({ ...prev, avatar: errorMessage }));
            } else {
                // Handle general errors
                setErrors(prev => ({
                    ...prev,
                    username: errorMessage || "Error updating profile"
                }));
            }
        }
    };

    const getInputClassName = (fieldName) => `
        w-full px-3 py-2 bg-[#8a93bf] text-white rounded-md 
        focus:outline-none focus:ring-2 
        ${errors[fieldName] ? 'ring-2 ring-red-500' : 'focus:ring-[#6f84c7]'}
    `;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50">
            <div className="bg-[#694ac7] w-full max-w-md p-6 rounded-lg">
                <div className="flex justify-center items-center mb-6">
                    <h3 className="text-white text-xl font-bold">Edit Profile</h3>
                </div>

                <div className="mb-4 flex flex-col items-center">
                    <div className="relative inline-block">
                        {formData.avatar ? (
                            <img
                                src={formData.avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-4 border-white object-cover"
                            />
                        ) : (
                            <FaCircleUser className="w-24 h-24 text-[#8a93bf] border-4 rounded-full border-white object-cover" />
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"
                            type="button"
                        >
                            <IoCameraReverse className="text-[#694ac7]" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    {errors.avatar && (
                        <p className="text-[#f67878] text-sm mt-1">{errors.avatar}</p>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white mb-2">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, username: e.target.value }));
                                setErrors(prev => ({ ...prev, username: "" }));
                            }}
                            className={getInputClassName('username')}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="text-[#f67878] text-sm mt-1">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-white mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, name: e.target.value }));
                                setErrors(prev => ({ ...prev, name: "" }));
                            }}
                            className={getInputClassName('name')}
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <p className="text-[#f67878] text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-white mb-2">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, bio: e.target.value }));
                                setErrors(prev => ({ ...prev, bio: "" }));
                            }}
                            className={getInputClassName('bio')}
                            placeholder="Tell us about yourself"
                            rows="3"
                        />
                        {errors.bio && (
                            <p className="text-[#f67878] text-sm mt-1">{errors.bio}</p>
                        )}
                        <div className="text-sm text-white mt-1">
                            {formData.bio.length}/150 characters
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-2 text-white bg-[#f67878] rounded-lg hover:bg-[#ea5f5f] disabled:opacity-50"
                            type="button"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="flex-1 py-2 text-white bg-[#6f84c7] rounded-lg hover:bg-[#586aa6] disabled:opacity-50"
                            type="button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileDialog;