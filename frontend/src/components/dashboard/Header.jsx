import {
  Bell,
  Search,
  Moon,
  Sun,
  UserCircle2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800 bg-[#08111f]/95 px-8 backdrop-blur-md">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-white">
          AgentShield Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Enterprise AI Security Operations Center
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
          />

        </div>

        {/* Theme */}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-300 hover:border-cyan-500 hover:text-cyan-400"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}

        <button className="relative rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-300 hover:border-cyan-500 hover:text-cyan-400">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

        </button>

        {/* Profile */}

        <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 hover:border-cyan-500">

          <UserCircle2
            size={40}
            className="text-cyan-400"
          />

          <div>

            <h3 className="font-semibold text-white">
              Arun Goud
            </h3>

            <p className="text-xs text-slate-400">
              Security Analyst
            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-slate-400"
          />

        </div>

      </div>

    </header>
  );
}