import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import TopBar from "./common/TopBar.tsx";

import './App.css';

function App() {
  return (
    <Router>
      <TopBar></TopBar>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
    </Router>
  );
}

export default App;
