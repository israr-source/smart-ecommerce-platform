import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiShoppingBag } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinkClass = ({ isActive }) =>
        `text-xl font-bold transition-all duration-300 px-4 py-2 rounded-full ${isActive ? 'text-primary bg-primary/10 scale-105' : 'text-slate-600 hover:text-primary hover:bg-base-200 hover:scale-105'}`;

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className="navbar glass-nav sticky top-0 z-50 px-4 sm:px-8 py-4">
            <div className="navbar-start">
                {/* Empty start for centering alignment if needed, or just flex-1 */}
            </div>
            <div className="navbar-center">
                <Link to="/" className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transform hover:scale-105 transition-transform flex items-center gap-2">
                    <span className="text-secondary"><FiShoppingBag /></span>
                    Shoply
                </Link>
            </div>
            <div className="navbar-end flex gap-2">
                {/* Login / Logout Section */}
                {localStorage.getItem('token') ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-primary">
                            <div className="w-10 rounded-full">
                                <img alt="User" src={JSON.parse(localStorage.getItem('user'))?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(JSON.parse(localStorage.getItem('user'))?.name || 'User')}&background=random`} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52">
                            <li><button onClick={() => window.location.href = '/profile'}>Profile</button></li>
                            <li><button onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}>Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary text-white btn-sm px-6">Login</Link>
                )}

                {/* Hamburger Menu (All Links) */}
                <div
                    className={`dropdown dropdown-end ${isOpen ? 'dropdown-open' : ''}`}
                    onBlur={(e) => {
                        // Close if focus leaves the dropdown container
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <label
                        tabIndex={0}
                        className={`btn btn-ghost btn-circle swap swap-rotate ${isOpen ? 'swap-active' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {/* hamburger icon */}
                        <svg className="swap-off fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>

                        {/* close icon */}
                        <svg className="swap-on fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-64 p-4 gap-2">
                        <li><NavLink to="/" onClick={handleLinkClick} className={({ isActive }) => `text-xl py-3 ${isActive ? "text-primary font-bold" : ""}`}>Home</NavLink></li>
                        <li><NavLink to="/about" onClick={handleLinkClick} className={({ isActive }) => `text-xl py-3 ${isActive ? "text-primary font-bold" : ""}`}>About Us</NavLink></li>
                        <li><NavLink to="/products" onClick={handleLinkClick} className={({ isActive }) => `text-xl py-3 ${isActive ? "text-primary font-bold" : ""}`}>Products</NavLink></li>
                        <li><NavLink to="/contact" onClick={handleLinkClick} className={({ isActive }) => `text-xl py-3 ${isActive ? "text-primary font-bold" : ""}`}>Contact</NavLink></li>
                        {localStorage.getItem('token') && (
                            JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? (
                                <li><NavLink to="/admin/dashboard" onClick={handleLinkClick} className={({ isActive }) => `text-xl py-3 ${isActive ? "text-primary font-bold" : ""}`}>Dashboard</NavLink></li>
                            ) : (
                                <li><NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `text-xl py-3 ${isActive ? "text-primary font-bold" : ""}`}>Dashboard</NavLink></li>
                            )
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
