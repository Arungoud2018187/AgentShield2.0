import {
  Bell,
  Search,
  Moon,
  Sun,
  UserCircle2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = `/${user?.role?.toLowerCase()}`;
  const profilePath = user?.role?.toUpperCase() === "EMPLOYEE" ? `${basePath}/profile` : `${basePath}/settings`;
  const notificationsPath = `${basePath}/notifications`;

  const submitSearch = (event) => {
    event.preventDefault();
    if (search.trim()) navigate(`${basePath}/users?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 flex min-h-[70px] items-center justify-between gap-4 border-b border-slate-800 bg-[#101725]/95 px-4 backdrop-blur-md sm:px-5 lg:px-6">

      {/* Left */}

      <div>

        <h1 className="text-xl font-bold text-white sm:text-2xl">
          AgentShield Dashboard
        </h1>

        <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">
          Enterprise AI Security Operations Center
        </p>

      </div>

      {/* Right */}

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">

        {/* Search */}

        <form className="relative" onSubmit={submitSearch}>

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-28 rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 sm:w-48 lg:w-60"
          />

        </form>

        {/* Theme */}

        <button
          onClick={() => {
            setDarkMode(!darkMode);
            document.documentElement.classList.toggle("light", darkMode);
          }}
          aria-label="Toggle theme"
          className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-cyan-500 hover:text-cyan-400"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}

        <button onClick={() => navigate(notificationsPath)} aria-label="Open notifications" className="relative rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-cyan-500 hover:text-cyan-400">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

        </button>

        {/* Profile */}

        <button onClick={() => navigate(profilePath)} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-left hover:border-cyan-500 sm:px-3">

          <UserCircle2
            size={32}
            className="text-cyan-400"
          />

          <div className="hidden sm:block">

            <h3 className="font-semibold text-white">
              {user?.full_name || "Account"}
            </h3>

            <p className="text-xs text-slate-400">
              {user?.role || "User"}
            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-slate-400"
          />

        </button>

      </div>

    </header>
  );
}