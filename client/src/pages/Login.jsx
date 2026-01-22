import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const syncUserWithBackend = async (user) => {
        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/users/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || name || 'User',
                    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || name || 'User')}&background=random`
                })
            });

            if (res.ok) {
                const mongoUser = await res.json();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({
                    ...mongoUser,
                    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || name || 'User')}&background=random`
                }));
                navigate('/dashboard');
            } else {
                console.error("Sync failed");
                alert("Login failed during sync");
            }
        } catch (error) {
            console.error("Sync error:", error);
            alert("Error syncing user");
        }
    };

    const handleLogin = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            await syncUserWithBackend(result.user);
        } catch (error) {
            console.error("Login failed:", error);
            alert(error.message);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (isSignUp) {
                result = await createUserWithEmailAndPassword(auth, email, password);
                // Update Firebase Profile immediately
                const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`;
                await updateProfile(result.user, {
                    displayName: name,
                    photoURL: photoURL
                });
                // Update local user object manually for immediate sync uses
                // (though sync uses the result.user object, it might not refresh instantly without reload, 
                // but we pass param below effectively)
            } else {
                result = await signInWithEmailAndPassword(auth, email, password);
            }
            await syncUserWithBackend(result.user);
        } catch (error) {
            console.error("Email auth failed:", error);
            alert(error.message);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token); // Store as generic token for now, or handle separate adminToken
                // Actually, existing Navbar checks 'token'. Storing here is fine as long as we distinguish role.
                localStorage.setItem('user', JSON.stringify({ ...data, photoURL: 'https://ui-avatars.com/api/?name=Admin+User' }));
                window.location.href = '/admin/dashboard'; // Force reload to update Navbar state or navigate
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    const handleGoogleLogin = () => handleLogin(new GoogleAuthProvider());
    const handleGithubLogin = () => handleLogin(new GithubAuthProvider());

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex h-screen w-full bg-base-100 overflow-hidden">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 relative animate-fade-in">
                <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-bounce-slow"></div>

                <h1 className="text-6xl font-bold mb-4 z-10 drop-shadow-lg">Shoply</h1>
                <p className="text-xl text-indigo-100 max-w-md text-center z-10 font-light">
                    Experience the future of shopping with our curated smart gadgets.
                </p>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 animate-slide-up">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Sign in to continue your journey</p>
                    </div>

                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-boxed mb-4">
                        <a role="tab" className={`tab ${loginType === 'user' ? 'tab-active' : ''}`} onClick={() => { setLoginType('user'); setShowPassword(false); }}>User Login</a>
                        <a role="tab" className={`tab ${loginType === 'admin' ? 'tab-active' : ''}`} onClick={() => { setLoginType('admin'); setShowPassword(false); }}>Admin Login</a>
                    </div>

                    {loginType === 'user' ? (
                        <>
                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                {isSignUp && (
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Name</span></label>
                                        <input type="text" placeholder="John Doe" className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                )}
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Email</span></label>
                                    <input type="email" placeholder="user@example.com" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Password</span></label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="input input-bordered w-full pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full shadow-lg">{isSignUp ? 'Sign Up' : 'Login'}</button>

                                <div className="text-center text-sm">
                                    <span className="text-gray-500">{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
                                    <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-primary font-bold hover:underline">
                                        {isSignUp ? 'Login' : 'Sign Up'}
                                    </button>
                                </div>
                            </form>

                            <div className="divider">OR</div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300 font-medium group"
                                >
                                    <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
                                    <span>Continue with Google</span>
                                </button>

                                <button
                                    onClick={handleGithubLogin}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl shadow-lg bg-[#24292e] text-white hover:bg-[#2f363d] hover:shadow-xl transition-all duration-300 font-medium group"
                                >
                                    <FaGithub className="text-2xl group-hover:scale-110 transition-transform" />
                                    <span>Continue with GitHub</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleAdminLogin} className="space-y-4 mt-8">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input name="email" type="email" placeholder="admin@shoply.com" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="admin"
                                        className="input input-bordered w-full pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-full">Login as Admin</button>
                        </form>
                    )}

                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-400">
                            By continuing, you agree to our <a href="#" className="underline hover:text-indigo-600">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 1s ease-out; }
                .animate-slide-up { animation: slide-up 0.8s ease-out; }
                .animate-bounce-slow { animation: bounce 4s infinite; }
            `}</style>
        </div>
    );
};

export default Login;
