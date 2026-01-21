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
                // Store combined info or just mongoUser (which includes _id and role)
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({
                    ...mongoUser,
                    photoURL: user.photoURL // Mongo might not have photo yet, preserve it
                }));
                navigate('/dashboard');
            } else {
                console.error("Sync failed");
                alert("Login failed during sync");
            }
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
