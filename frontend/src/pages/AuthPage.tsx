import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// Single unified auth page (Customer / Insurance Authority)
// Frontend only – no API calls

const AuthPage = () => {
  const {par} = useParams();
  const [role, setRole] = useState<"customer" | "authority">("customer");
  const [mode, setMode] = useState<"signin" | "signup">(par);
  const [remember, setRemember] = useState(false);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");



  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(mode=="signup"){
            try {
              console.log("heerr in the submit")
                const response = await axios.post("http://localhost:3000/api/auth/signup",{
                  name:name,
                  email:email,
                  password:password,
                  role:role,
                })

                console.log(response.data.message)
                setMode("signin");
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                const response = await axios.post("http://localhost:3000/api/auth/signin",{
                 
                  email:email,
                  password:password,
                 
                })

                console.log(response.data.message)
            } catch (error) {
                console.log(error);
            }
        }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4">
      {/* Auth Card */}
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
        {/* Header */}
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            SmartClaim
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {role === "customer"
              ? "Access your insurance claims"
              : "Insurance authority portal"}
          </p>
        </div>

        {/* Role Switch */}
        <div className="mt-6 px-6">
          <div className="grid grid-cols-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 p-1">
            <button
              onClick={() => setRole("customer")}
              className={`rounded-md py-2 text-sm font-medium transition ${
                role === "customer"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole("authority")}
              className={`rounded-md py-2 text-sm font-medium transition ${
                role === "authority"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              Authority
            </button>
          </div>
        </div>

        {/* Mode Switch */}
        <div className="mt-4 px-6 flex gap-6 text-sm">
          <button
            onClick={() => setMode("signin")}
            className={`pb-1 transition ${
              mode === "signin"
                ? "border-b-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`pb-1 transition ${
              mode === "signup"
                ? "border-b-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 px-6 pb-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                Full Name
              </label>
              <input
              onChange={(e)=>setName(e.target.value)}
              value={name}
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              placeholder={
                role === "customer"
                  ? "you@example.com"
                  : "official@company.com"
              }
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              type="password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-neutral-800 dark:accent-neutral-200"
            />
            Remember me
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-neutral-900 dark:bg-neutral-100 py-2.5 text-sm font-medium text-white dark:text-neutral-900 transition hover:opacity-90"
          >
            {mode === "signin"
              ? `Sign in as ${role === "customer" ? "Customer" : "Authority"}`
              : `Create ${role === "customer" ? "Customer" : "Authority"} Account`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;