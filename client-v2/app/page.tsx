import CoreWorkspace from "@/components/main-page/CoreWorkspace";
import Footer from "@/components/main-page/Footer";
import Navbar from "@/components/main-page/Navbar";
import AuthProvider from "@/providers/AuthProvider";
import PrivateProfileProvider from "@/providers/PrivateProfileProvider";

const MainPage = () => {
    return (
        <AuthProvider>
            <PrivateProfileProvider>
                <div className="h-screen w-full bg-[#F8F8F8] text-zinc-900 font-sans flex flex-col selection:bg-emerald-100">
                    {/* ===== Navbar ===== */}
                    <Navbar />

                    {/* ===== Core workspace ===== */}
                    <CoreWorkspace />

                    {/* ===== Footer ===== */}
                    <Footer />
                </div>
            </PrivateProfileProvider>
        </AuthProvider>
    );
};

export default MainPage;