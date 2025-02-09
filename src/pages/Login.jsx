import React, { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { GiBleedingEye } from "react-icons/gi";
import { RiEyeCloseFill } from "react-icons/ri";
import { MdOutlinePhotoCameraBack } from "react-icons/md";
import BG from "./../assets/images/BG.webp";
import signupValidator from "../utils/SignupValidator";
import axios from "axios"
import { userExists } from "../redux/reducers/auth";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    username: "",
    email: "",
    password: "",
    avatar: null
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const dispatch = useDispatch();


  const toggleTab = (tab) => setActiveTab(tab);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: file  
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post("/api/v1/user/login", {
          username: formData.username,
          password:  formData.password,
        },
          config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async(e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const validationErrors = signupValidator(formData);
    setErrors(validationErrors);

    
    if (Object.keys(validationErrors).length === 0) {

      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('about', formData.about);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
  
      try {
        const { data } = await axios.post("/api/v1/user/newuser", formDataToSend,
          config
        );
        dispatch(userExists(data.user));
        toast.success(data.message, {
          id: toastId,
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something Went Wrong", {
          id: toastId,
        })
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[100vh] text-gray-900"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      <div className="w-full max-w-md p-6 space-y-2 bg-[#8a93bf] rounded shadow-lg">
        <div className="flex justify-between">
          <button
            className={`px-3 py-1 font-semibold ${
              activeTab === "login"
                ? "border-b-2 border-[#694ac7] text-[#694ac7]"
                : "text-white"
            }`}
            onClick={() => toggleTab("login")}
            disabled={isLoading}
          >
            Login
          </button>
          <button
            className={`px-3 py-1 font-semibold ${
              activeTab === "signup"
                ? "border-b-2 border-[#694ac7] text-[#694ac7]"
                : "text-white"
            }`}
            onClick={() => toggleTab("signup")}
            disabled={isLoading}
          >
            Signup
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoComplete="off"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694ac7] ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694ac7] ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <RiEyeCloseFill className="text-[#694ac7]" />
                    ) : (
                      <GiBleedingEye className="text-[#694ac7]" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <a href="#!" className="text-sm text-[#694ac7]">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-[#694ac7] rounded-md hover:bg-[#5e41b4]"
                disabled={isLoading}
              >
                Sign In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-full h-full overflow-hidden bg-gray-200 rounded-full flex items-center justify-center border-4 border-[#694ac7]">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaCircleUser className="text-[#8a93bf] w-20 h-20 border-[#694ac7]" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-[#694ac7] rounded-full cursor-pointer hover:bg-[#5e41b4]">
                  <MdOutlinePhotoCameraBack className="text-white w-4 h-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694ac7] ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">About</label>
                <input
                  type="text"
                  name="about"
                  autoComplete="off"
                  value={formData.about}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694ac7] ${
                    errors.about ? "border-red-500" : ""
                  }`}
                  placeholder="About yourself"
                />
                {errors.about && (
                  <p className="text-red-500 text-xs">{errors.about}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoComplete="off"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694ac7] ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694ac7] ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694ac7] ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Create a password"
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <RiEyeCloseFill className="text-[#694ac7]" />
                    ) : (
                      <GiBleedingEye className="text-[#694ac7]" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white bg-[#694ac7] rounded-md hover:bg-[#5e41b4]"
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

