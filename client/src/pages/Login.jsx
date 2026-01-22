import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();

            // Sync with backend
            const res = await fetch('/api/users/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                })
            });

            if (res.ok) {
                const mongoUser = await res.json();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({
                    ...mongoUser,
                    photoURL: user.photoURL
                }));
                navigate('/dashboard');
            } else {
                console.error("Sync failed");
                alert("Login failed during sync");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert(error.message);
        }
    };

    const handleGoogleLogin = () => handleLogin(new GoogleAuthProvider());
    const handleGithubLogin = () => handleLogin(new GithubAuthProvider());

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

                    <div className="space-y-4 mt-8">
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
