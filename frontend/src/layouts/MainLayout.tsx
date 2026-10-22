import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../pages/client/home/Footer";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-[#f3f9ff]">
            <Navbar />
            <main >
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}