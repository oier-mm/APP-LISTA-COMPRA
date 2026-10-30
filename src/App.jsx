import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sections from "./pages/Sections";
import CreateSection from "./pages/CreateSection";
import JoinSection from "./pages/JoinSection";
import Lists from "./pages/Lists";
import CreateList from "./pages/CreateList";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/secciones" element={<Sections />} />
        <Route path="/crear-seccion" element={<CreateSection />} />
        <Route path="/unirse-seccion" element={<JoinSection />} />
        <Route path="/listas" element={<Lists />} />
        <Route path="/crear-lista" element={<CreateList />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/nuevo-producto" element={<AddProduct />} />
        <Route path="/estadisticas" element={<Statistics />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </Router>
  );
}