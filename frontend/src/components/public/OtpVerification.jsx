
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

const OtpVerification = () => {
  const { login, getRole, isAuthenticated } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('VerifyOtp.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('VerifyOtp.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to initialize. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const role = getRole();
      console.log('VerifyOtp.jsx: isAuthenticated changed, role:', role);
      toast.success('Logged in successfully!');

      setTimeout(() => {
        window.location.href = role === 'admin' ? '/admin/dashboard' : '/';
      }, 1500); // Delay to allow toast to show
    }
  }, [isAuthenticated, getRole]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/verify-otp',
        { userId: state?.userId, otp },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      console.log('VerifyOtp.jsx: OTP Verification Response:', response.data);

      if (response.data.success) {
        const { token, userId } = response.data;
        if (!token || !userId) {
          throw new Error('Missing token or userId in response');
        }
        console.log('VerifyOtp.jsx: JWT Token:', token);
        const decoded = jwtDecode(token);
        console.log('VerifyOtp.jsx: Decoded JWT:', decoded);
        sessionStorage.clear(); // Clear any stale tokens
        login(token, userId, state?.rememberMe);
        console.log('VerifyOtp.jsx: Login called with:', { userId, rememberMe: state?.rememberMe });
      } else {
        toast.error(response.data.message || 'Invalid or expired OTP.');
      }
    } catch (error) {
      console.error('VerifyOtp.jsx: OTP Verification Error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Error verifying OTP. Please try again.';
      toast.error(message);
      if (message.includes('Invalid or expired OTP')) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!state?.userId || !state?.email) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-pink-400 to-pink-600 mb-6" />
          <div className="px-8 py-6">
            <p className="text-sm text-red-500">Invalid session. Please log in again.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 mt-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-pink-400 to-pink-600 mb-6" />
        <div className="px-8 py-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1 text-left">Verify OTP</h2>
          <p className="text-sm text-gray-400 mb-6 text-left">
            Enter the 6-digit OTP sent to {state.email || 'your email'}.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setOtp(value);
                }}
                className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isCsrfLoading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 transition disabled:opacity-60"
            >
              {isLoading ? 'Verifying...' : isCsrfLoading ? 'Loading...' : 'Verify OTP'}
            </button>
          </form>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

// const OtpVerification = () => {
//   const { login, getRole, isAuthenticated } = useAuth();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [csrfToken, setCsrfToken] = useState('');
//   const [isCsrfLoading, setIsCsrfLoading] = useState(true);

//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
//         setCsrfToken(response.data.csrfToken);
//         console.log('CSRF Token fetched:', response.data.csrfToken);
//       } catch (error) {
//         console.error('CSRF Token Error:', error.message);
//         toast.error('Failed to initialize. Please refresh the page.');
//       } finally {
//         setIsCsrfLoading(false);
//       }
//     };
//     fetchCsrfToken();
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const role = getRole();
//       console.log('Authenticated, role:', role);
//       toast.success('Logged in successfully!');
//       setTimeout(() => {
//         window.location.href = role === 'admin' ? '/admin/dashboard' : '/';
//       }, 1500);
//     }
//   }, [isAuthenticated, getRole]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
//       toast.error('Please enter a valid 6-digit OTP.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         'http://localhost:3000/api/v1/auth/verify-otp',
//         { userId: state?.userId, otp },
//         { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
//       );
//       console.log('OTP Verification Response:', response.data);
//       if (response.data.success) {
//         const { token, userId } = response.data;
//         if (!token || !userId) throw new Error('Missing token or userId');
//         console.log('JWT Token:', token);
//         const decoded = jwtDecode(token);
//         console.log('Decoded JWT:', decoded);
//         sessionStorage.clear();
//         login(token, userId, state?.rememberMe);
//         console.log('Login called with:', { userId, rememberMe: state?.rememberMe });
//       } else {
//         toast.error(response.data.message || 'Invalid or expired OTP.');
//         if (response.data.message === 'Invalid OTP') {
//           console.log('Invalid OTP attempt logged');
//         } else if (response.data.message === 'Invalid or expired OTP') {
//           console.log('Expired OTP attempt logged');
//         }
//       }
//     } catch (error) {
//       console.error('OTP Verification Error:', error.response?.data || error.message);
//       const message = error.response?.data?.message || 'Error verifying OTP. Please try again.';
//       toast.error(message);
//       if (message.includes('Invalid or expired OTP')) {
//         setTimeout(() => navigate('/login'), 3000);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!state?.userId || !state?.email) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-[#F3F4F6] font-sans">
//         <div className="bg-white p-7 rounded-2xl shadow-lg w-[27rem] max-w-lg">
//           <p className="text-sm text-red-500">Invalid session. Please log in again.</p>
//           <button
//             onClick={() => navigate('/login')}
//             className="w-full p-3 mt-4 rounded-lg font-semibold text-white bg-[#00bf63] hover:bg-[#009f4e] transition"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#F3F4F6] font-sans">
//       <div className="bg-white p-7 rounded-2xl shadow-lg w-[27rem] max-w-lg">
//         <h2 className="text-3xl font-medium text-start text-gray-800">Verify OTP</h2>
//         <p className="text-sm text-gray-500 text-start mb-6 mt-2">
//           Enter the 6-digit OTP sent to {state.email || 'your email'}.
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 font-medium">OTP</label>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/[^0-9]/g, '');
//                 setOtp(value);
//               }}
//               className="w-full p-3 text-black border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
//               placeholder="Enter 6-digit OTP"
//               maxLength={6}
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={isLoading || isCsrfLoading}
//             className={`w-full p-3 rounded-lg font-semibold text-white transition ${isLoading || isCsrfLoading ? 'bg-[#009f4e] cursor-not-allowed' : 'bg-[#00bf63] hover:bg-[#009f4e]'}`}
//           >
//             {isLoading ? 'Verifying...' : isCsrfLoading ? 'Loading...' : 'Verify OTP'}
//           </button>
//         </form>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
//     </div>
//   );
// };

// export default OtpVerification;

