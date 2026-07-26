import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#020617]">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}

        <Header />

        {/* Page */}

        <main className="flex-1 overflow-y-auto bg-[#020617] p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}