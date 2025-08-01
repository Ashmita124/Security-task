
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { isAuthenticated, getRole } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', recaptchaToken: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Fetch CSRF token
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('Login.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('Login.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleRecaptchaChange = (token) => {
    setFormData({ ...formData, recaptchaToken: token });
    setErrors({ ...errors, recaptchaToken: '' });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validate = () => {
    let temp = {};
    if (!formData.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = 'Enter a valid email';
    }
    if (!formData.password) {
      temp.password = 'Password is required';
    }
    if (!formData.recaptchaToken) {
      temp.recaptchaToken = 'Please complete the reCAPTCHA';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          recaptchaToken: formData.recaptchaToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('OTP sent to your email!');
        navigate('/verify-otp', { state: { userId: response.data.userId, email: formData.email, rememberMe } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg.includes('Please verify your email')) {
        toast.error('Please verify your email before logging in');
        navigate('/verify-otp', { state: { userId: error.response?.data?.userId, email: formData.email, rememberMe } });
      } else if (msg.includes('Invalid credentials')) {
        toast.error('Invalid email or password');
      } else if (msg.includes('reCAPTCHA')) {
        toast.error('reCAPTCHA verification failed');
      } else if (msg.includes('Account is locked')) {
        toast.error('Too many attempts. Please try again after 15 minutes.');
      } else if (msg.includes('Error sending OTP email')) {
        toast.error('Failed to send OTP email. Please try again later.');
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error('Login failed: Please try again.');
      }
      console.error('Login.jsx: Login Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const role = getRole();
      toast.success('Already logged in!');
      navigate(role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, [isAuthenticated, getRole, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-pink-400 to-pink-600 mb-6" />
        <div className="px-8 py-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1 text-left">Log in</h2>
          <p className="text-sm text-gray-400 mb-6 text-left">Welcome back! Sign in to start your beauty journey.</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
                onChange={handleRecaptchaChange}
              />
            </div>
            {errors.recaptchaToken && <p className="text-red-500 text-xs mt-1 text-center">{errors.recaptchaToken}</p>}
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center space-x-2 text-black">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="accent-pink-600"
                />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="text-pink-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading || isCsrfLoading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 transition disabled:opacity-60"
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : isCsrfLoading ? (
                'Loading...'
              ) : (
                'Log in'
              )}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-6">
            New to QuickBites?{' '}
            <Link to="/register" className="text-pink-600 underline">
              Create Account
            </Link>
          </p>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
        </div>
      </div>
    </div>
  );
};

export default Login;
