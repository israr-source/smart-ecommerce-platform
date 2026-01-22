import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    const navLinkClass = ({ isActive }) =>
        `text-lg font-bold transition-all duration-300 px-4 py-2 rounded-full ${isActive ? 'text-primary bg-primary/10 scale-105' : 'text-slate-600 hover:text-primary hover:bg-base-200 hover:scale-105'}`;

    return (
        <div className="navbar glass-nav sticky top-0 z-50 px-4 sm:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52">
                        <li><NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>Home</NavLink></li>
                        <li><NavLink to="/products" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>Products</NavLink></li>
                        <li><NavLink to="/contact" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>Contact</NavLink></li>
                        {localStorage.getItem('token') && <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-primary font-bold" : ""}>Dashboard</NavLink></li>}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transform hover:scale-105 transition-transform">Shoply</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-8">
                    <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
                    <li><NavLink to="/products" className={navLinkClass}>Products</NavLink></li>
                    <li><NavLink to="/contact" className={navLinkClass}>Contact</NavLink></li>
                    {localStorage.getItem('token') && <li><NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink></li>}
                </ul>
            </div>
            <div className="navbar-end">
                {localStorage.getItem('token') ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-primary">
                            <div className="w-10 rounded-full">
                                <img alt="User" src={JSON.parse(localStorage.getItem('user'))?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52">
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
            </div>
        </div>
    );
};

export default Navbar;
