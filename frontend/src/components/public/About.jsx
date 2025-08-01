import { FaEnvelope, FaMobileAlt, FaMoneyBillWave, FaPhone, FaShieldAlt, FaShippingFast, FaSpa, FaUsers } from "react-icons/fa";
import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const About = () => {
    return (
        <>
            <Layout />
            <div className="max-w-5xl mx-auto p-6 bg-white mt-10 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold text-center text-pink-600 mb-6 flex items-center justify-center gap-2">
                    <FaSpa className="text-pink-400" /> About Beauty Bliss
                </h1>
                <p className="text-pink-400 text-sm text-center mb-6">
                    Empowering Your Beauty, One Product at a Time 💄
                </p>

                <div className="space-y-6 text-gray-700">
                    {/* Our Story */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-pink-600">Our Story</h2>
                        <p>
                            Beauty Bliss was founded with a passion to help everyone discover their unique beauty. What started as a small boutique has blossomed into a trusted destination for premium beauty products, skincare, and self-care essentials.
                        </p>
                    </section>

                    {/* Our Mission */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-pink-600">Our Mission</h2>
                        <p>
                            We strive to make beauty accessible, enjoyable, and empowering for all. Our mission is to provide high-quality products, expert advice, and a seamless shopping experience—so you can look and feel your best every day.
                        </p>
                    </section>

                    {/* Why Choose Beauty Bliss */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-pink-600">
                            <FaUsers className="text-pink-400" /> Why Choose Beauty Bliss?
                        </h2>
                        <ul className="list-none space-y-2">
                            <li className="flex items-center gap-2">
                                <FaShippingFast className="text-pink-400" /> <strong>Fast & Reliable Delivery</strong> – Get your beauty essentials delivered quickly and safely.
                            </li>
                            <li className="flex items-center gap-2">
                                <FaMoneyBillWave className="text-pink-400" /> <strong>Affordable Luxury</strong> – Premium products at prices you'll love.
                            </li>
                            <li className="flex items-center gap-2">
                                <FaMobileAlt className="text-pink-400" /> <strong>Easy Shopping</strong> – Simple website and mobile experience.
                            </li>
                            <li className="flex items-center gap-2">
                                <FaShieldAlt className="text-pink-400" /> <strong>Secure Payments</strong> – Multiple safe and secure payment options.
                            </li>
                        </ul>
                    </section>

                    {/* Our Team */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-pink-600">Our Team</h2>
                        <p>
                            We are a dedicated team of beauty enthusiasts, skincare experts, and customer care professionals working together to make your Beauty Bliss experience inspiring and delightful. Your satisfaction is our top priority.
                        </p>
                    </section>

                    {/* Join Our Community */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-pink-600">Join Our Community</h2>
                        <p>
                            Whether you’re a beauty lover searching for the latest trends or a brand looking to reach more customers, Beauty Bliss welcomes you. Join us in redefining beauty and self-care!
                        </p>
                    </section>

                    {/* Contact Us */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-pink-600">
                            <FaEnvelope className="text-pink-400" /> Contact Us
                        </h2>
                        <p>Have questions or feedback? We’d love to hear from you!</p>
                        <p className="mt-2 flex items-center gap-2">
                            <FaEnvelope className="text-pink-400" /> <strong>Email:</strong> support@beautybliss.com
                        </p>
                        <p className="flex items-center gap-2">
                            <FaPhone className="text-pink-400" /> <strong>Phone:</strong> +1 234 567 890
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
