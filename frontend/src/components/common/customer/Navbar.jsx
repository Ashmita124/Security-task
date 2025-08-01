import { Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { VscHeart } from "react-icons/vsc";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        localStorage.removeItem("rememberMe");
                        sessionStorage.clear();
                        setIsAuthenticated(false);
                        window.location.href = "/";
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        setIsAuthenticated(!!token);
    }, []);

    const handleSignInClick = () => navigate("/login");
    const handleSignUpClick = () => navigate("/register");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/searchresult?query=${searchQuery}`);
        }
    };

    const activeLinkStyle = ({ isActive }) =>
        isActive
            ? "text-black border-b-2 border-[#00bf63] transition duration-300"
            : "text-black text-base hover:border-b-2 hover:border-[#00bf63] transition duration-300";

    return (
        <div className="bg-white shadow-lg text-black sticky w-full top-0 left-0 z-50">
            <div className="flex justify-between items-center p-3 max-w-7xl mx-auto">
                {/* Navigation Links */}
                <div className="flex items-center space-x-8 ml-10">
                    <NavLink to="/" className={({ isActive }) =>
                        isActive
                            ? "text-black border-b-2 border-pink-500 transition duration-300"
                            : "text-black text-base hover:border-b-2 hover:border-pink-500 transition duration-300"
                    }>Home</NavLink>
                    <NavLink to="/menu" className={({ isActive }) =>
                        isActive
                            ? "text-black border-b-2 border-pink-500 transition duration-300"
                            : "text-black text-base hover:border-b-2 hover:border-pink-500 transition duration-300"
                    }>Products</NavLink>
                    <NavLink to="/about-us" className={({ isActive }) =>
                        isActive
                            ? "text-black border-b-2 border-pink-500 transition duration-300"
                            : "text-black text-base hover:border-b-2 hover:border-pink-500 transition duration-300"
                    }>About</NavLink>

                    {/* Search Bar */}
                    <div className="flex items-center bg-pink-100 p-2 rounded-lg w-80 shadow-sm">
                        <input
                            type="text"
                            placeholder="Search beauty products"
                            className="ml-2 bg-transparent outline-none w-full text-pink-600 placeholder-pink-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={handleSearch} className="text-pink-500 ml-2">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Icons & Buttons */}
                <div className="flex items-center space-x-6 mr-10">
                    <Link to="/wishlist" className="text-2xl text-pink-500"><VscHeart /></Link>
                    <Link to="/cart" className="text-2xl text-pink-500"><ShoppingCart /></Link>

                    {isAuthenticated ? (
                        <>
                            {/* My Account Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-white text-black text-base hover:text-pink-500 px-4 py-2"
                                >
                                    My Account
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                                        <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-pink-50 text-black">
                                            <User className="w-4 h-4 mr-2" />
                                            My Profile
                                        </Link>
                                        <Link to="/my-orders" className="flex items-center px-4 py-2 hover:bg-pink-50 text-black">
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            My Orders
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Log Out Button */}
                            <button
                                className="bg-white text-black text-base hover:text-pink-500 px-4 py-2"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Sign In & Sign Up Buttons */}
                            <button
                                className="text-black text-base border border-pink-500 px-4 py-2 rounded-md hover:bg-pink-500 hover:text-white transition duration-300"
                                onClick={handleSignInClick}
                            >
                                Sign In
                            </button>
                            <button
                                className="text-white bg-pink-500 text-base border border-pink-500 px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300"
                                onClick={handleSignUpClick}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
