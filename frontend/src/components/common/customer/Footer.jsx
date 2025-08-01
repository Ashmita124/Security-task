import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-pink-100 text-pink-700 py-10">
            <div className="container mx-auto grid grid-cols-5 md:grid-cols-4 gap-8">
                {/* About Section */}
                <div className='ml-20'>
                    <h2 className="text-2xl font-bold flex items-center space-x-5 text-pink-600">
                        <span>BEAUTY BLISS</span>
                    </h2>
                    <p className="mt-4 text-pink-400">
                        Beauty Bliss brings you the best in skincare, makeup, and self-care essentials—delivered with love and care.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-pink-600">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/about-us" className="text-pink-400 hover:underline">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/contact-us" className="text-pink-400 hover:underline">
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a href="/delivery-charges" className="text-pink-400 hover:underline">
                                Delivery Charges
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Other Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-pink-600">Other Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/privacy-and-policy" className="text-pink-400 hover:underline">
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="/terms-and-conditions" className="text-pink-400 hover:underline">
                                Terms & Conditions
                            </a>
                        </li>
                        <li>
                            <a href="/refund-policy" className="text-pink-400 hover:underline">
                                Refund Policy
                            </a>
                        </li>
                        <li>
                            <a href="/cancellation-policy" className="text-pink-400 hover:underline">
                                Cancellation Policy
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-pink-600">Contact Us</h3>
                    <ul className="space-y-2 text-pink-400">
                        <li>
                            <a href="mailto:support@beautybliss.com" className="hover:underline">
                                support@beautybliss.com
                            </a>
                        </li>
                        <li>+1 234 567 890</li>
                        <li>123 Beauty Ave, Glamour City</li>
                    </ul>
                    <div className="flex space-x-4 mt-4">
                        <a href="https://www.facebook.com/beautybliss" className="text-pink-400 hover:text-pink-600" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-xl" />
                        </a>
                        <a href="https://www.linkedin.com/company/beautybliss" className="text-pink-400 hover:text-pink-600" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="text-xl" />
                        </a>
                        <a href="https://x.com/beautybliss" className="text-pink-400 hover:text-pink-600" target="_blank" rel="noopener noreferrer">
                            <FaXTwitter className="text-xl" />
                        </a>
                        <a href="https://www.instagram.com/beautybliss" className="text-pink-400 hover:text-pink-600" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-xl" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-pink-200 mt-10 pt-4 text-center text-pink-400 text-sm">
                Copyright © 2024 Beauty Bliss | All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;
