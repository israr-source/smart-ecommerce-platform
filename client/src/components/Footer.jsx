import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-neutral text-neutral-content">
            <div className="footer py-2 px-10 max-w-7xl mx-auto">
                <aside>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Shoply</h2>
                    <p className="max-w-xs text-sm opacity-80">
                        Your one-stop shop for the latest smart gadgets and electronics.
                        Experience quality and innovation.
                    </p>
                </aside>
                <nav>
                    <h6 className="footer-title opacity-100 text-white mb-0">Quick Links</h6>
                    <Link to="/" className="link link-hover hover:text-primary transition-colors">Home</Link>
                    <Link to="/products" className="link link-hover hover:text-primary transition-colors">Shop</Link>
                    <Link to="/about" className="link link-hover hover:text-primary transition-colors">About Us</Link>
                    <Link to="/contact" className="link link-hover hover:text-primary transition-colors">Contact</Link>
                </nav>
                <nav>
                    <h6 className="footer-title opacity-100 text-white mb-0">Company</h6>
                    <a className="link link-hover hover:text-primary transition-colors">Terms of Use</a>
                    <a className="link link-hover hover:text-primary transition-colors">Privacy Policy</a>
                    <a className="link link-hover hover:text-primary transition-colors">Cookie Policy</a>
                </nav>
                <nav>
                    <h6 className="footer-title opacity-100 text-white mb-0">Social</h6>
                    <div className="grid grid-flow-col gap-4">
                        <a className="btn btn-circle btn-sm btn-ghost hover:bg-blue-600 hover:text-white transition-all duration-300">
                            <FaFacebookF className="text-lg" />
                        </a>
                        <a className="btn btn-circle btn-sm btn-ghost hover:bg-sky-500 hover:text-white transition-all duration-300">
                            <FaTwitter className="text-lg" />
                        </a>
                        <a className="btn btn-circle btn-sm btn-ghost hover:bg-pink-600 hover:text-white transition-all duration-300">
                            <FaInstagram className="text-lg" />
                        </a>
                        <a className="btn btn-circle btn-sm btn-ghost hover:bg-blue-700 hover:text-white transition-all duration-300">
                            <FaLinkedinIn className="text-lg" />
                        </a>
                    </div>
                </nav>
            </div>
            <div className="footer footer-center p-4 bg-neutral-focus text-base-content border-t border-neutral-content/10">
                <aside>
                    <p className="text-sm text-white font-medium">Copyright © 2026 - All right reserved by Shoply Ltd</p>
                </aside>
            </div>
        </footer>
    );
};

export default Footer;
