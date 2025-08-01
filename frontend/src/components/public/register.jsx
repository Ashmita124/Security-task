
import axios from "axios";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/auth/csrf-token", { withCredentials: true })
      .then((response) => {
        console.log("CSRF Token fetched:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
        toast.error("Failed to initialize form security.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "terms") {
      setIsChecked(checked);
      setErrors((prevErrors) => ({ ...prevErrors, terms: "" }));
    } else if (type === "checkbox" && name === "rememberMe") {
      setRememberMe(checked);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validatePassword = (password) => {
    const result = zxcvbn(password);
    const minScore = 3; // Require "good" strength
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$%^&*]/.test(password),
      strength: result.score >= minScore,
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
      errors: {
        length: requirements.length ? "" : "Password must be at least 8 characters.",
        uppercase: requirements.uppercase ? "" : "Password must include at least one uppercase letter.",
        lowercase: requirements.lowcase ? "" : "Password must include at least one lowercase letter.",
        number: requirements.number ? "" : "Password must include at least one number.",
        special: requirements.special ? "" : "Password must include at least one special character (@, #, $, etc.).",
        strength: requirements.strength ? "" : "Password is too weak.",
      },
    };
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required.";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required.";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = Object.values(passwordValidation.errors)
          .filter(Boolean)
          .join(" ");
      }
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!isChecked) {
      newErrors.terms = "You must agree to the Terms and Conditions.";
    }
    if (!recaptchaToken) {
      newErrors.captcha = "Please complete the CAPTCHA.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          ...formData,
          recaptchaToken,
          termsAccepted: isChecked,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        const { token, userId, role } = response.data;
        if (rememberMe) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('role', role);
        }
        login(token, userId, rememberMe);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaChange = (value) => {
    setRecaptchaToken(value);
    setErrors((prevErrors) => ({ ...prevErrors, captcha: "" }));
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-pink-400 to-pink-600 mb-6" />
        <div className="px-8 py-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1 text-left">Create Account</h2>
          <p className="text-sm text-gray-400 mb-6 text-left">Sign up to start your beauty journey.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center mb-1">
                <span className="w-6 h-6 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mr-2 text-xs font-bold">1</span>
                <label className="text-gray-700 font-semibold text-sm">First Name</label>
              </div>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                placeholder="Enter first name"
              />
              {errors.fname && <p className="text-red-500 text-xs mt-1">{errors.fname}</p>}
            </div>
            <div>
              <div className="flex items-center mb-1">
                <span className="w-6 h-6 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mr-2 text-xs font-bold">2</span>
                <label className="text-gray-700 font-semibold text-sm">Last Name</label>
              </div>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                placeholder="Enter last name"
              />
              {errors.lname && <p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
            </div>
            <div>
              <div className="flex items-center mb-1">
                <span className="w-6 h-6 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mr-2 text-xs font-bold">3</span>
                <label className="text-gray-700 font-semibold text-sm">Phone</label>
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <div className="flex items-center mb-1">
                <span className="w-6 h-6 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mr-2 text-xs font-bold">4</span>
                <label className="text-gray-700 font-semibold text-sm">Email</label>
              </div>
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
              <div className="flex items-center mb-1">
                <span className="w-6 h-6 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mr-2 text-xs font-bold">5</span>
                <label className="text-gray-700 font-semibold text-sm">Password</label>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              <div className="mt-2 text-xs text-gray-500">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5 list-none">
                  <li className="flex items-center">
                    {passwordValidation.requirements.length ? (
                      <span className="text-green-500 mr-1">&#10003;</span>
                    ) : (
                      <span className="text-red-400 mr-1">&#10007;</span>
                    )}
                    <span className={passwordValidation.requirements.length ? "text-green-600" : "text-gray-500"}>
                      At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center">
                    {passwordValidation.requirements.uppercase ? (
                      <span className="text-green-500 mr-1">&#10003;</span>
                    ) : (
                      <span className="text-red-400 mr-1">&#10007;</span>
                    )}
                    <span className={passwordValidation.requirements.uppercase ? "text-green-600" : "text-gray-500"}>
                      One uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center">
                    {passwordValidation.requirements.lowercase ? (
                      <span className="text-green-500 mr-1">&#10003;</span>
                    ) : (
                      <span className="text-red-400 mr-1">&#10007;</span>
                    )}
                    <span className={passwordValidation.requirements.lowercase ? "text-green-600" : "text-gray-500"}>
                      One lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center">
                    {passwordValidation.requirements.number ? (
                      <span className="text-green-500 mr-1">&#10003;</span>
                    ) : (
                      <span className="text-red-400 mr-1">&#10007;</span>
                    )}
                    <span className={passwordValidation.requirements.number ? "text-green-600" : "text-gray-500"}>
                      One number
                    </span>
                  </li>
                  <li className="flex items-center">
                    {passwordValidation.requirements.special ? (
                      <span className="text-green-500 mr-1">&#10003;</span>
                    ) : (
                      <span className="text-red-400 mr-1">&#10007;</span>
                    )}
                    <span className={passwordValidation.requirements.special ? "text-green-600" : "text-gray-500"}>
                      One special character (@, #, $, etc.)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-1">
                <span className="w-6 h-6 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full mr-2 text-xs font-bold">6</span>
                <label className="text-gray-700 font-semibold text-sm">Confirm Password</label>
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-pink-50 text-black text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={isChecked}
                  onChange={handleChange}
                  className="accent-pink-600 mr-2"
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I agree to the <a href="#" className="text-pink-600 underline">Terms and Conditions</a>
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleChange}
                  className="accent-pink-600 mr-2"
                />
                <label htmlFor="rememberMe" className="text-xs text-gray-600">Remember Me</label>
              </div>
            </div>
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
                onChange={onCaptchaChange}
              />
            </div>
            {errors.captcha && <p className="text-red-500 text-xs text-center">{errors.captcha}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 transition disabled:opacity-60"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 underline">Login</Link>
          </p>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
        </div>
      </div>
    </div>
  );
};

export default Register;
