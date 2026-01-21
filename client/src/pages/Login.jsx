import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();

            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            }));

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Join our community to shop for the best products.</p>
                    <button onClick={handleGoogleLogin} className="btn btn-primary">Sign in with Google</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
