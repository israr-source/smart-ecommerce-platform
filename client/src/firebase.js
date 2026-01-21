import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBggRtFz-V3VnG6GKy8AL2jwh1mJmLQh2Q",
    authDomain: "smart-ecommerce-auth-c4aa6.firebaseapp.com",
    projectId: "smart-ecommerce-auth-c4aa6",
    storageBucket: "smart-ecommerce-auth-c4aa6.firebasestorage.app",
    messagingSenderId: "983718691861",
    appId: "1:983718691861:web:0a964ce1a3bc6109557a1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
