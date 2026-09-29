import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { NoticeProvider } from "../context/NoticeProvider";
import Notice from "../components/Notice";

export default function AppLayout() {
  return (
    <NoticeProvider>
      <div className="min-h-screen bg-[#070b14] text-white">
        <Navbar />

        <main>
          <Outlet />
        </main>
        <Notice />
      </div>
    </NoticeProvider>
  );
}
