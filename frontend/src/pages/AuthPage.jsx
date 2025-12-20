import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ContextAPI } from "@/Context";

// Single unified auth page (Customer / Insurance Authority)
// Frontend only – no API calls
const AuthPage = () => {
    const { par } = useParams();
    const [role, setRole] = useState("customer");
    const [mode, setMode] = useState(par);
    const [remember, setRemember] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { loginBro } = useContext(ContextAPI);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode == "signup") {
            try {
                console.log("heerr in the submit");
                const response = await axios.post("http://localhost:3000/api/auth/signup", {
                    name: name,
                    email: email,
                    password: password,
                    role: role,
                });
                console.log(response.data.message);
                setMode("signin");
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const response = await axios.post("http://localhost:3000/api/auth/signin", {
                    email: email,
                    password: password,
                });
                const userDetails = {
                    name: response.data.name,
                    email: response.data.email,
                    userId: response.data.userId,
                    role: response.data.role,
                    token: response.data.token
                };
                loginBro(userDetails);
            }
            catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800">
                
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {mode === "signin" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                        {mode === "signin" ? "Sign in to manage your claims" : "Get started with your insurance journey"}
                    </p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                        onClick={() => setRole("customer")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            role === "customer" 
                            ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-white shadow-sm" 
                            : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                        }`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => setRole("authority")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            role === "authority" 
                            ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-white shadow-sm" 
                            : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                        }`}
                    >
                        Authority
                    </button>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {mode === "signup" && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-neutral-800 dark:border-neutral-700"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-neutral-300">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        {mode === "signin" ? "Sign in" : "Create Account"}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
                        >
                            {mode === "signin" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
