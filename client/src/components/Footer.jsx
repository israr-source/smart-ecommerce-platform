import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-neutral-900 text-gray-300 font-sans tracking-wide">
            <div className="py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row flex-wrap justify-between gap-10">
                    {/* Brand Section */}
                    <aside className="lg:w-1/3">
                        <Link to="/" className="mb-4 inline-block">
                            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                                Shoply
                            </h2>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Your one-stop shop for the latest smart gadgets and electronics.
                            Experience quality, innovation, and exceptional customer service specifically tailored for you.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <FaFacebookF size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-sky-500 text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-700 text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <FaLinkedinIn size={18} />
                            </a>
                        </div>
                    </aside>

                    {/* Navigation Links */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 lg:justify-items-center">
                        <nav className="flex flex-col gap-3">
                            <h6 className="text-white text-lg font-bold mb-2">Quick Links</h6>
                            <Link to="/" className="hover:text-blue-400 transition-colors text-sm">Home</Link>
                            <Link to="/products" className="hover:text-blue-400 transition-colors text-sm">Shop</Link>
                            <Link to="/about" className="hover:text-blue-400 transition-colors text-sm">About Us</Link>
                            <Link to="/contact" className="hover:text-blue-400 transition-colors text-sm">Contact</Link>
                        </nav>

                        <nav className="flex flex-col gap-3">
                            <h6 className="text-white text-lg font-bold mb-2">Company</h6>
                            <Link to="/terms" className="hover:text-blue-400 transition-colors text-sm">Terms of Use</Link>
                            <Link to="/privacy" className="hover:text-blue-400 transition-colors text-sm">Privacy Policy</Link>
                            <Link to="/cookie" className="hover:text-blue-400 transition-colors text-sm">Cookie Policy</Link>
                            <Link to="/faq" className="hover:text-blue-400 transition-colors text-sm">FAQs</Link>
                        </nav>

                        <nav className="flex flex-col gap-3 col-span-2 md:col-span-1">
                            <h6 className="text-white text-lg font-bold mb-2">Contact</h6>
                            <p className="text-sm text-gray-400">Chattogram, Bangladesh</p>
                            <p className="text-sm text-gray-400 mt-2">support@shoply.com</p>
                            <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Copyright Area */}
            <div className="bg-neutral-950 py-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-gray-500">
                        Copyright © {new Date().getFullYear()} - All rights reserved by <span className="text-gray-300 font-semibold">Shoply Ltd</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
