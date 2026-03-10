import React, { useState } from "react";
import { User, Lock, RefreshCcw, Sun, Moon, Trash2, ChevronDown, Mail, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";

// ==========================================
// 1. SUB-FORM COMPONENTS (Internal Logic)
// ==========================================

const ProfileForm = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      console.log("Profile Updated:", formData);
      setIsSaving(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

          const handleDeleteAccount = () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );

  if (confirmDelete) {
    // Call your backend API here
    console.log("Account deleted");

    // example API call
    // await axios.delete("/api/user/delete");

    // redirect user after delete
    // navigate("/signup");
  }
};

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" placeholder="First Name" 
          className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        />
        <input 
          type="text" placeholder="Last Name" 
          className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        />
      </div>
      <input 
        type="email" placeholder="Email Address" 
        className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20">
        {isSaving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
};

const PasswordForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password Change logic triggered");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input type="password" placeholder="Current Password" className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none" />
      <input type="password" placeholder="New Password" className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none" />
      <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
        Update Password
      </button>
    </form>
  );
};

const ResetTokenForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`http://localhost:5000/api/users/resetPasswordToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.success ? "✅ Reset link sent to your email!" : "❌ " + (data.message || "Failed."));
    } catch (error) {
      setMessage("❌ Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">We will send a secure reset link to your registered email.</p>
      <form onSubmit={handleResetRequest} className="flex flex-col md:flex-row gap-3">
        <input 
          type="email" required placeholder="email@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500" 
        />
        <button disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50">
          {isLoading ? "Sending..." : "Send Link"}
        </button>
      </form>
      {message && <p className="text-sm font-medium animate-in fade-in slide-in-from-top-1">{message}</p>}
    </div>
  );
};

// ==========================================
// 2. MAIN SETTINGS PAGE
// ==========================================

export default function Settings() {
  const [openSection, setOpenSection] = useState("profile");
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const sections = [
    { id: "profile", label: "Update Profile", icon: <User size={20} />, color: "text-blue-500", component: <ProfileForm /> },
    { id: "password", label: "Change Password", icon: <Lock size={20} />, color: "text-green-500", component: <PasswordForm /> },
    { id: "reset", label: "Reset Password", icon: <RefreshCcw size={20} />, color: "text-purple-500", component: <ResetTokenForm /> },
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-black p-4 md:p-10 text-slate-900 dark:text-slate-100">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account preferences and security.</p>
        </header>

        <div className="space-y-4">
          {/* Dynamic Sections */}
          {sections.map((section) => (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${openSection === section.id ? "bg-slate-50 dark:bg-slate-800/50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`${section.color}`}>{section.icon}</span>
                  <span className="font-semibold text-lg">{section.label}</span>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${openSection === section.id ? "rotate-180" : ""}`} />
              </button>

              <div className={`transition-all duration-300 ease-in-out ${openSection === section.id ? "max-h-[500px] opacity-100 p-6 border-t border-slate-100 dark:border-slate-800" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {section.component}
              </div>
            </div>
          ))}

          {/* Theme Section (Non-Form) */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-yellow-500">{theme === "light" ? <Sun size={20} /> : <Moon size={20} />}</span>
                <div>
                  <p className="font-semibold text-lg">Theme Settings</p>
                  <p className="text-sm text-slate-500">Currently using {theme} mode</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 dark:bg-blue-600 transition-colors"
              >
                <span className={`${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform`} />
              </button>
            </div>
          </div>


  
{/* Danger Zone (Static) */}
<div className="overflow-hidden rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6">
  <div className="flex items-center gap-4 mb-3">
    <Trash2 className="text-red-600" size={20} />
    <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">
      Danger Zone
    </h3>
  </div>

  <p className="text-sm text-red-500 mb-4">
    Deleting your account is permanent and cannot be undone.
  </p>

  <button
    onClick={handleDeleteAccount}
    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition-all"
  >
    Delete My Account
  </button>
</div>

        </div>
      </div>
    </div>
  );
}