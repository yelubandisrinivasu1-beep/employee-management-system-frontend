"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        const { token, data } = response.data;
        login(token, data);

        // Redirect based on role
        switch (data.role) {
          case "admin":
          case "manager":
            router.push("/manager");
            break;
          case "technical_manager":
            router.push("/technical-manager");
            break;
          case "employee":
            router.push("/employee");
            break;
          default:
            router.push("/");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
        { email, newPassword: password }
      );

      if (response.data.success) {
        setSuccessMsg(response.data.message);
        setShowForgotPassword(false);
        setPassword("");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex text-slate-800 bg-slate-100">
      {/* Left side Image & Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r border-indigo-500/20 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 to-blue-900/20 mix-blend-multiply z-10"></div>
        <img src="/company_hero.png" alt="Company Tech Building" className="absolute inset-0 w-full h-full object-cover z-0 opacity-80" />
        <div className="relative z-20 flex flex-col justify-end p-12 h-full bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent w-full">
          {/* Some branding over the image */}
          <div className="w-16 h-1 bg-blue-500 mb-8 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
          <h1 className="text-4xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-xl">
            Enterprise<br />Excellence
          </h1>
          <p className="text-lg text-indigo-100 max-w-lg mb-8 font-light drop-shadow">
            Connecting teams, streamlining assignments, and driving robust analytics through our premier internal communications portal.
          </p>
          <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mt-4">
            Pengwin Tech Solution © {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* Right side Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-[-5%] right-[-5%] w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl z-0"></div>

        <div className="w-full max-w-md bg-white/60 backdrop-blur-3xl p-10 sm:p-12 rounded-[2rem] shadow-2xl shadow-indigo-100 border border-white/80 z-10">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold bg-gradient-to-br from-blue-700 to-indigo-800 bg-clip-text text-transparent mb-3">
              {showForgotPassword ? "Reset Password" : "Welcome Back"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {showForgotPassword ? "Enter your email and a new password to reset it." : "Please sign in to your Pengwin Tech account."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3 shadow-sm">
              <FiAlertCircle className="text-rose-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-rose-800 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl flex items-start gap-3 shadow-sm">
              <p className="text-sm text-emerald-800 font-medium leading-relaxed">{successMsg}</p>
            </div>
          )}

          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="email">
                  Work Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all font-medium shadow-sm"
                    placeholder="you@pengwin.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="password">
                    Password
                  </label>
                  <button type="button" onClick={() => { setShowForgotPassword(true); setError(""); setSuccessMsg(""); }} className="text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    Forgot yours?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all font-medium shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 group py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-2 transform disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_16px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In Securely</span>
                    <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="reset-email">
                  Work Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all font-medium shadow-sm"
                    placeholder="you@pengwin.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="new-password">
                    New Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all font-medium shadow-sm"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 group py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-2 transform disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_16px_-6px_rgba(16,185,129,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button type="button" onClick={() => { setShowForgotPassword(false); setError(""); setSuccessMsg(""); }} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Quick Testing Access */}
          <div className="mt-10 pt-8 border-t border-slate-200/60">
            <p className="text-[10px] text-center text-slate-400 font-bold mb-4 tracking-widest uppercase">Quick Testing Access</p>
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={() => { setEmail("admin@examples.com"); setPassword("123456"); }} className="flex-1 py-2 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all uppercase">Admin</button>
              <button type="button" onClick={() => { setEmail("manager@examples.com"); setPassword("123456"); }} className="flex-1 py-2 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all uppercase">Manager</button>
              <button type="button" onClick={() => { setEmail("employee@examples.com"); setPassword("123456"); }} className="flex-1 py-2 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all uppercase">Employee</button>
            </div>
          </div>

          <div className="mt-8 p-5 bg-white/50 rounded-2xl border border-slate-200/60 shadow-sm">
            <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
              <FiAlertCircle className="w-3 h-3 text-blue-500" /> Terms & Conditions
            </p>
            <p className="text-[11px] text-slate-500/80 leading-relaxed text-center font-medium">
              By accessing the Pengwin Tech portal, you agree to our corporate policies on data privacy, professional conduct, and security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
