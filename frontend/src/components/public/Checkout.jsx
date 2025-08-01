import KhaltiCheckout from "khalti-checkout-web";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";

const Checkout = () => {

    const userId = localStorage.getItem("userId");

    const navigate = useNavigate();
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];


    if (!cartItems || cartItems.length === 0) {
        return <div>No items in the cart!</div>;
    }

    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0;
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [billingDetails, setBillingDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
    });

    const handleInputChange = (e) => {
        setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    }

    const khaltiConfig = {
        publicKey: "test_public_key_617c4c6fe77c441d88451ec1408a0c0e",
        productIdentity: "1234567890",
        productName: "Order Payment",
        productUrl: "http://localhost:3000",
        eventHandler: {
            onSuccess(payload) {
                console.log("Payment Successful:", payload);

                fetch("http://localhost:3000/api/khalti/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: payload.token, amount: totalPrice }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.message === "Payment verified successfully") {
                            toast.success("Payment successful!");
                            const orderData = {
                                userId,
                                cartItems: cartItems.map(item => ({
                                    itemId: item.itemId,
                                    price: item.itemId.price,
                                    quantity: item.quantity,
                                })),
                                billingDetails,
                                paymentMethod: "khalti",
                                subtotal,
                                deliveryCharge,
                                totalPrice,
                                status: "pending",
                            };

                            fetch("http://localhost:3000/api/v1/order/orders", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(orderData),
                            })
                                .then((res) => {
                                    if (res.ok) {
                                        return res.json();
                                    } else {
                                        throw new Error("Server responded with an error");
                                    }
                                })
                                .then((data) => {
                                    localStorage.removeItem("cartItems");
                                    toast.success("Order placed successfully!", {
                                        position: "top-right",
                                        autoClose: 5000,
                                    });


                                    setTimeout(() => {
                                        navigate("/checkout/success");
                                    }, 5000);
                                })
                                .catch((error) => {
                                    console.error("Error:", error);
                                    toast.error("Error placing order. Please try again.", {
                                        position: "top-right",
                                        autoClose: 5000,
                                    });
                                });
                        } else {
                            toast.error("Payment verification failed!");
                        }
                    })
                    .catch((err) => console.error("Error verifying payment:", err));
            },
            onError(error) {
                console.error("Payment Error:", error);
                toast.error("Khalti Payment Failed!");
            },
        },
    };




    const handleOrderSubmit = async () => {
        if (totalPrice > 200.0) {
            toast.error("Amount exceeds the limit of Rs 200. Please reduce the total price.");
            return;
        }

        if (paymentMethod === "khalti") {
            const khalti = new KhaltiCheckout(khaltiConfig);
            khalti.show({ amount: totalPrice * 100 });
            return;
        }
        const orderData = {
            userId,
            cartItems: cartItems.map(item => ({
                itemId: item.itemId,
                price: item.itemId.price,
                quantity: item.quantity,
            })),
            billingDetails,
            paymentMethod,
            subtotal,
            deliveryCharge,
            totalPrice,
            status: "pending",
        };

        try {
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("cartItems");
                toast.success("Order placed successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                setTimeout(() => {

                    navigate("/checkout/success");
                }, 5000);
            } else {
                toast.error("Error placing order. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <>
            <Layout />
            <div className="bg-gray-100 min-h-screen py-10">
                <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Checkout</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-300">
                                <h3 className="text-xl font-semibold mb-4">Billing Details</h3>
                                <div className="space-y-4">
                                    <input type="text" name="fullName" placeholder="Full Name" value={billingDetails.fullName} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    <input type="email" name="email" placeholder="Email Address" value={billingDetails.email} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    <input type="text" name="phone" placeholder="Phone Number" value={billingDetails.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    <input type="text" name="address" placeholder="Street Address" value={billingDetails.address} onChange={handleInputChange} className="w-full p-3 border-gray-400 border rounded-md" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="city" placeholder="City" value={billingDetails.city} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                        <input type="text" name="zipCode" placeholder="Zip Code" value={billingDetails.zipCode} onChange={handleInputChange} className="w-full p-3 border border-gray-400 rounded-md" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <label className={`flex flex-col p-4 border-b cursor-pointer ${paymentMethod === "khalti" ? "bg-gray-100" : ""}`} onClick={() => handlePaymentChange("khalti")}>
                                        <div className="flex items-center">
                                            <input type="radio" name="paymentMethod" value="khalti" checked={paymentMethod === "khalti"} onChange={() => handlePaymentChange("khalti")} className="hidden" />
                                            <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex justify-center items-center mr-3">
                                                {paymentMethod === "khalti" && <span className="w-3 h-3 bg-orange-500 rounded-full"></span>}
                                            </span>
                                            <span className="text-gray-800">Online Payment (Khalti)</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Fast and secure online payment with Khalti.</p>
                                    </label>

                                    <label className={`flex flex-col p-4 cursor-pointer ${paymentMethod === "cod" ? "bg-gray-100" : ""}`} onClick={() => handlePaymentChange("cod")}>
                                        <div className="flex items-center">
                                            <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => handlePaymentChange("cod")} className="hidden" />
                                            <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex justify-center items-center mr-3">
                                                {paymentMethod === "cod" && <span className="w-3 h-3 bg-orange-500 rounded-full"></span>}
                                            </span>
                                            <span className="text-gray-800">Cash on Delivery</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Pay in cash when your order is delivered.</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-300 min-h-[300px]">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h3>
                            <div className="flex justify-between font-medium border-b pb-2">
                                <span>Product</span>
                                <span>Subtotal</span>
                            </div>

                            <div className="space-y-4 mt-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} className="w-12 h-12 rounded-lg object-cover" />
                                            <span>{item.itemId.name} × {item.quantity}</span>
                                        </div>
                                        <span className="font-semibold">${(item.itemId.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between font-medium">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Delivery Charge:</span>
                                    <span>${deliveryCharge.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
                                    <span>Total:</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button onClick={handleOrderSubmit} className="bg-[#ff7918] text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-[#e66b14] transition">
                            {paymentMethod === "khalti" ? "Pay Now" : "Confirm Order"}
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
            <Footer />
        </>
    );
};

export default Checkout; 