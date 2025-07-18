import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ onLogin, onShowSignup }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
     try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // <-- This is required for session cookies!
     body: JSON.stringify({ email: form.email, password: form.password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Login successful!");
      setLoading(false);
        if (onLogin) onLogin();
    } else {
      setMessage(data.error || "Login failed.");
      setLoading(false);
    }
  } catch (err) {
    setMessage("Network error.");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
        {/* Road Lines Animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent mt-8 animate-pulse delay-75"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent mt-16 animate-pulse delay-150"></div>
        </div>
        
        {/* Floating Car Icons */}
        <div className="absolute top-20 left-10 text-blue-400 opacity-30 animate-bounce">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
        
        <div className="absolute top-40 right-20 text-purple-400 opacity-20 animate-pulse">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
        
        <div className="absolute bottom-20 left-1/4 text-cyan-400 opacity-25 animate-bounce delay-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
          </svg>
        </div>

        {/* Hexagonal Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 p-8">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="w-8 h-8 border border-blue-500 transform rotate-45 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>

        {/* Speed Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-10 w-32 h-px bg-gradient-to-r from-transparent to-cyan-400 opacity-60 animate-pulse transform -skew-y-12"></div>
          <div className="absolute top-1/2 -left-20 w-48 h-px bg-gradient-to-r from-transparent to-blue-400 opacity-40 animate-pulse transform -skew-y-12 delay-100"></div>
          <div className="absolute top-2/3 -left-16 w-40 h-px bg-gradient-to-r from-transparent to-purple-400 opacity-50 animate-pulse transform -skew-y-12 delay-200"></div>
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Glass Effect Container */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Header with Car Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <p className="text-gray-300 text-xl">Login your account</p>
            </div>

            {message && (
              <div className={`text-center mb-6 p-3 rounded-lg font-medium ${
                message.includes("success") 
                  ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                
                <a href="#" className="mx-30 text-sm text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-60 transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Loging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-gray-400 text-sm">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
              
              <p className="text-gray-300 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  onClick={onShowSignup}
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default Login; 