import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Alumni from "./pages/Alumni.jsx";
import Events from "./pages/Events.jsx";
import Mentorship from "./pages/Mentorship.jsx";
import Fundraising from "./pages/Fundraising.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/events" element={<Events />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/fundraising" element={<Fundraising />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
