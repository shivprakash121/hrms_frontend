import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules"; // Correct import for modules
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import loginImage1 from "../assets/Image/loginavatar.jpg";
import loginImage2 from "../assets/Image/loginavatar2.jpg";
import loginImage3 from "../assets/Image/loginavatar3.jpg";
import ddHealthcare from "../assets/Icon/ddHealthcare.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUserDataAction } from "../store/action/userLogin";
import { Bounce, ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, data, error: msg } = useSelector((state) => state.loginData);

  useEffect(() => {
    if (msg) {
      toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
  }, [msg])
  const [toasts, setToasts] = useState([])
  const addToast = (type, message) => {
    const id = new Date().getTime(); // Unique ID for each toast
    setToasts([...toasts, { id, type, message }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 3000);
  };


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      toast.success(data?.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to dashboard if token exists
        localStorage.setItem('employeId', data?.data?.employeeId)
      }, 1000);
      return;
    }
    else {
      navigate("/")
    }

  }, [navigate, msg, data]);
  const handleLogin = async (e) => {
    e.preventDefault();


    if (!email || !password) {
      toast.error('Please fill in all fields.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    try {
      const response = await dispatch(
        loginUserDataAction({ email, password })
      );

    } catch (err) {
      // Handle API or network errors

    }
  };


  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-gray-100">

        {/* Left Section with Carousel */}
        <div className="hidden lg:flex w-1/2 bg-white justify-center items-center">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="w-full max-w-lg"
          >
            <SwiperSlide>
              <div className="text-center">
                <img
                  src={loginImage1}
                  alt="Onboarding Illustration 1"
                  style={{width:'300px'}}
                  className="mx-auto mb-6"
                />
                <h1 className="text-2xl font-bold mb-2">
                  Onboarding New Talent with Digital HRMS
                </h1>
                <p className="text-gray-600">
                  Everything you need in an easily customizable dashboard.
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center">
                <img
                  src={loginImage2}
                  alt="Onboarding Illustration 2"
                  style={{width:'280px'}}
                  className="mx-auto mb-6"
                />
                <h1 className="text-2xl font-bold mb-2">Track Your Progress</h1>
                <p className="text-gray-600">
                  Gain insights into team performance at a glance.
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center">
                <img
                  src={loginImage3}
                  style={{width:'280px'}}
                  alt="Onboarding Illustration 3"
                  className="mx-auto mb-6"
                />
                <h1 className="text-2xl font-bold mb-2">Streamline HR Tasks</h1>
                <p className="text-gray-600">
                  Simplify complex HR workflows with a single click.
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Right Section */}
        <div className="flex w-full lg:w-1/2 justify-center items-center p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <img src={ddHealthcare} alt="Logo" className="mx-auto mb-4" />
              <h1 className="text-2xl font-semibold">Welcome Back!</h1>
              <p className="text-gray-600">Please enter your details</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-700 mb-2 font-semibold"
                >
                  Employee Code / Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-700 mb-2 font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-700"
              >
                Login
              </button>
            </form>
            <Link to={'/forget_password'} className="flex mt-4 text-end text-blue-600">Forget password?</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
