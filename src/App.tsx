import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./common/AuthProvider.tsx";

import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleEdit from './pages/ArticleEdit';
import TopBar from "./common/TopBar.tsx";
import Footer from "./common/Footer.tsx";
import "./App.css";
import Contact from "./pages/Contact.tsx";
import Signup from "./pages/Signup.tsx";
import QnAList from "./pages/QnAList.tsx";
import QnAThread from "./pages/QnAThread.tsx";
import ProductEdit from "./pages/ProductEdit.tsx";
import Product from "./pages/Product.tsx";
import ProductSearch from "./pages/ProductSearch.tsx";
import Order from "./pages/Order.tsx";

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
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/articles/edit/:id" element={<ArticleEdit />} />
          <Route path="/qa" element={<QnAList />} />
          <Route path="/qa/:threadId" element={<QnAThread />} />

          <Route path="/product/edit" element={<ProductEdit/>}/>
          <Route path="/product/" element={<Product/>}/>
          <Route path="/product/search" element={<ProductSearch/>}/>
          <Route path="/order" element={<Order/>}/>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
