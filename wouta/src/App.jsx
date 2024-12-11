// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import Convites from "./Component/Convites";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/projetos" element={<ProjectPage />} />
        <Route path="/create" element={<CreateProjectPage />} />
        <Route path="/edit/:projectId" element={<EditProjectPage />} />
        <Route path="/projeto/:projectId" element={<ProjectDetailPage />}  />
        <Route path="/convites" element={<Convites />} /> {/* Adicionado o componente Convites */}
      </Routes>
    </Router>
  );
};

export default App;
