import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
