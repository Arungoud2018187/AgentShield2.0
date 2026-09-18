import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-[#070c1b]">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Header */}

        <Header />

        {/* Page */}

        <main className="flex-1 overflow-y-auto bg-[#070c1b] p-4 sm:p-5 lg:p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}