import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070b14]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/20">
            <Sparkles size={18} />
          </div>

          <div>
            <span className="font-semibold tracking-tight">VideoNotes</span>

            <span className="ml-1.5 text-indigo-400">AI</span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">
              {user.name || "User"}
            </p>

            <p className="text-xs text-slate-500">Personal workspace</p>
          </div>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold">
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            title="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-red-400"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
