import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import CustomCursor from "./components/CustomCursor";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminRouter } from "./admin/AdminRouter";

// Public layout wrapper containing the navigation shells and floating shortcuts
function PublicLayout() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-gray-800">
      <Header onBookConsultation={() => setIsBookingModalOpen(true)} isModalOpen={isBookingModalOpen} />
      <main className="flex-grow">
        <Outlet context={{ setIsBookingModalOpen }} />
      </main>
      <Footer />
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        {/* New Admin Panel Routes */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/* Old Admin Pages (for backward compatibility) */}
        <Route path="/admin-old" element={<Admin />} />
        <Route path="/dashboard-old" element={<AdminDashboard />} />

        {/* Public facing pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
