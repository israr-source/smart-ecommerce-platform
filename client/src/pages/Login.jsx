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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-12 animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Shoply</h1>
                    <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
                </div>

                {/* Minimalist Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginType === 'user' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { setLoginType('user'); setShowPassword(false); }}
                    >
                        User
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginType === 'admin' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { setLoginType('admin'); setShowPassword(false); }}
                    >
                        Admin
                    </button>
                </div>

                {loginType === 'user' ? (
                    <>
                        <form onSubmit={handleEmailAuth} className="space-y-5">
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" placeholder="user@example.com" className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors pr-10"
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
                            <button type="submit" className="btn btn-primary w-full shadow-md text-white">{isSignUp ? 'Sign Up' : 'Sign In'}</button>

                            <div className="text-center text-sm text-gray-500">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-primary font-semibold hover:underline">
                                    {isSignUp ? 'Log in' : 'Sign up'}
                                </button>
                            </div>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleGoogleLogin}
                                className="btn btn-outline border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 normal-case"
                            >
                                <FcGoogle className="text-xl mr-2" /> Google
                            </button>
                            <button
                                onClick={handleGithubLogin}
                                className="btn btn-outline border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 normal-case"
                            >
                                <FaGithub className="text-xl mr-2" /> GitHub
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleAdminLogin} className="space-y-5">
                        <div className="alert alert-info shadow-sm text-sm py-2">
                            <span>Admin access requires authorized credentials.</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                            <input name="email" type="email" placeholder="admin@shoply.com" className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white transition-colors pr-10"
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
                        <button type="submit" className="btn btn-neutral w-full shadow-lg">Access Dashboard</button>
                    </form>
                )}
            </div>

            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.5s ease-out; }
            `}</style>
        </div>
    );
};

export default Login;
