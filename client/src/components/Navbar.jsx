import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar glass-nav sticky top-0 z-50 px-4 sm:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        {localStorage.getItem('token') && <li><Link to="/dashboard">Dashboard</Link></li>}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Shoply</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-6">
                    <li><Link to="/" className="text-lg font-bold text-gray-800 hover:text-primary transition-colors">Home</Link></li>
                    <li><Link to="/products" className="text-lg font-bold text-gray-800 hover:text-primary transition-colors">Products</Link></li>
                    <li><Link to="/contact" className="text-lg font-bold text-gray-800 hover:text-primary transition-colors">Contact</Link></li>
                    {localStorage.getItem('token') && <li><Link to="/dashboard" className="text-lg font-bold text-gray-800 hover:text-primary transition-colors">Dashboard</Link></li>}
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
