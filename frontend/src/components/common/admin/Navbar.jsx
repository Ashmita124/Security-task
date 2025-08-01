import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    // Function to handle closing the dropdown
    const handleDropdownClick = () => {
        setShowDropdown(false);
    };
    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        localStorage.clear();  // Clear local storage
                        window.location.href = "/login"; // Redirect to login page
                    },
                },
                {
                    label: "No", // Do nothing if user cancels
                },
            ],
        });
    };


    return (
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-white  px-6 py-4 z-50">
            {/* Hunger End Logo & Text */}
            <div className="flex items-center gap-2">
                {/* Logo removed as requested */}
            </div>

            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                {/* <div className="relative cursor-pointer">
                    <FaBell className="text-blue-500 text-xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        1
                    </span>
                </div>

                {/* Divider */}
                {/* <span className="text-gray-500">|</span> */}
                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2"
                    >
                        <span className="text-gray-700">Hello</span>

                        <img
                            src="/src/assets/images/restaurant.jpg"
                            alt="Profile"
                            className="w-8 h-8 rounded-full border"
                        />
                        <FaChevronDown className="text-gray-500 text-sm" /> {/* Chevron Down Icon */}
                    </button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
                            <ul className="text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <Link to="/admin/setting" onClick={handleDropdownClick}>
                                        Setting
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
// 