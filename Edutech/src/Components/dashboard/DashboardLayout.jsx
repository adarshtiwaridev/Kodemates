import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, GraduationCap, Home, PlusSquare, UserSquare2 } from "lucide-react";
import { useSelector } from "react-redux";

const DashboardLayout = ({ title, children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.profile?.user || state.auth?.user);
  const role = user?.accountType || user?.role;

  const teacherLinks = [
    { path: "/dashboard/teacher/courses", label: "My Courses", icon: <BookOpen size={16} /> },
    { path: "/dashboard/teacher/courses/create", label: "Create Course", icon: <PlusSquare size={16} /> },
  ];

  const studentLinks = [
    { path: "/dashboard/student/browse", label: "Browse Courses", icon: <GraduationCap size={16} /> },
    { path: "/dashboard/student/my-courses", label: "My Courses", icon: <UserSquare2 size={16} /> },
  ];

  const links = role === "Teacher" ? teacherLinks : studentLinks;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-1">{role} Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{user?.email}</p>

          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === "/dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Home size={16} />
              Overview
            </Link>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="lg:col-span-3 space-y-5">
          <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <h1 className="text-2xl font-bold">{title}</h1>
          </header>
          {children}
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
