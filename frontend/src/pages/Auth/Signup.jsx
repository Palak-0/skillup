import React, { useState } from "react";
import API from "../../api/api";

export default function SignupPage({ onAuth, onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be 6+ characters";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      onAuth(res.data.user);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      {/* LEFT SIDE - VISUAL/BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 relative overflow-hidden items-center justify-center p-12">
        {/* Subtle background decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 flex flex-col max-w-lg text-white">
          <div className="flex items-center gap-3 mb-12">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg> 
            <span className="text-2xl font-light tracking-widest uppercase">LEARNOS</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
            Learn.<br/>Build.<br/><span className="text-indigo-400">Grow.</span>
          </h1>
          <p className="text-indigo-200 text-lg font-light leading-relaxed mb-12">
            Your personalized learning journey starts here. Join thousands of students and instructors transforming their careers through interactive online education.
          </p>
          
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-800 bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs">
                  {String.fromCharCode(64+i)}
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-indigo-300">
              Trusted by 10k+ learners
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - SIGNUP FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100 fade-up relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8 text-slate-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg> 
            <span className="text-xl font-light tracking-widest uppercase">LEARNOS</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Create your account</h2>
            <p className="text-slate-500 text-sm">Join us and start your learning journey today.</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg border border-red-100">
              {errors.general}
            </div>
          )}

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"} bg-slate-50 focus:bg-white transition-all duration-200 outline-none focus:ring-4`}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <div className="text-red-500 text-xs mt-1.5">{errors.name}</div>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"} bg-slate-50 focus:bg-white transition-all duration-200 outline-none focus:ring-4`}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <div className="text-red-500 text-xs mt-1.5">{errors.email}</div>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  className={`w-full pl-4 pr-12 py-2.5 rounded-xl border ${errors.password ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"} bg-slate-50 focus:bg-white transition-all duration-200 outline-none focus:ring-4`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1.5">{errors.password}</div>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "student", label: "Student", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
                  { val: "instructor", label: "Instructor", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg> },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${form.role === r.val ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"}`}
                    onClick={() => setForm({ ...form, role: r.val })}
                  >
                    <div className="mb-1.5">{r.icon}</div>
                    <span className="text-xs font-bold tracking-wide uppercase">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button onClick={onSwitch} className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              Sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
