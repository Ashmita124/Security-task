import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // For Toast notifications
import "react-toastify/dist/ReactToastify.css";

const OrderSuccess = () => {
    const navigate = useNavigate();

    // Function to redirect the user back to the home page
    const handleGoHome = () => {
        navigate("/"); // Redirects to home page (can change as per your needs)
    };

    return (
        <>
            <div className="bg-[#ff7918] min-h-screen flex flex-col justify-center items-center py-20">
                <div className="bg-white p-12 rounded-xl shadow-xl text-center max-w-lg w-full">
                    <h2 className="text-2xl font-bold text-[#ff7918] mb-4">Order Placed Successfully!</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Your order has been placed successfully. Thank you for choosing us!
                    </p>
                    <div className="flex justify-center mb-8">
                        <img src="https://img.icons8.com/ios/452/checkmark.png" alt="Success" className="w-32 h-32" />
                    </div>
                    <div className="space-x-4">
                        <button
                            onClick={handleGoHome}
                            className="bg-[#ff7918] text-white px-8 py-4 rounded-full text-lg shadow-md hover:bg-[#e57b14] transition ease-in-out duration-200"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer /> {/* Display the toast notifications */}
        </>
    );
};

export default OrderSuccess;
