import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./common/AuthProvider.tsx";

import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";

import TopBar from "./common/TopBar.tsx";
import Footer from "./common/Footer.tsx";
import "./App.css";
import Contact from "./pages/Contact.tsx";
import Signup from "./pages/Signup.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
