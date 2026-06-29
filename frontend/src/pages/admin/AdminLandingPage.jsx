import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Settings,
  ArrowRight,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";

const AdminLandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginNavigation = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center z-10 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            SmartShop<span className="text-blue-400">Admin</span>
          </span>
        </div>
        <div>
          <button
            type="button"
            onClick={handleLoginNavigation}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 font-medium text-sm flex items-center space-x-2"
          >
            <span>Login</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Control Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Business
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate administration hub for SmartShop. Manage products,
            analyze orders, and oversee operations with unparalleled precision
            and style.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <button
              type="button"
              onClick={handleLoginNavigation}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] flex items-center space-x-3"
            >
              <span>Access Portal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24">
          <FeatureCard
            icon={<LayoutDashboard className="w-8 h-8 text-blue-400" />}
            title="Real-time Analytics"
            description="Monitor live sales data, track active users, and evaluate store performance at a glance."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-purple-400" />}
            title="User Management"
            description="Complete oversight of customer accounts, administrative roles, and permission levels."
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8 text-pink-400" />}
            title="System Configuration"
            description="Fine-tune platform settings, manage inventory rules, and customize storefront behavior."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-500 text-sm z-10 mt-12">
        <p>
          &copy; {new Date().getFullYear()} SmartShop AI. Secure Administration
          Environment.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
      <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default AdminLandingPage;
